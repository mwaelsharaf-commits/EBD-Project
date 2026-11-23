
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck2,
  CalendarDays,
  Clock3,
  Pencil,
  Trash2,
  Plus,
  Image as ImageIcon,
  X,
  Save,
  Flame,
} from "lucide-react";

import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./businessSlots.css";

const money = (value) =>
  `EGP ${Number(value).toLocaleString("en-EG")}`;

const formatDate = (value) =>
  new Date(value).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function toLocalDateTime(value) {
  const date = new Date(value);
  const local = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );
  return local.toISOString().slice(0, 16);
}

function getStatus(slot) {
  const start = new Date(slot.startTime).getTime();

  if (start <= Date.now()) return "past";
  if (slot.spotsLeft === 0) return "upcoming";
  return "active";
}

function SlotCard({ slot, onEdit, onDelete }) {
  const photo = slot.imageUrl || slot.photoUrl;

  return (
    <article className="business-slot-card">
      <div className="business-slot-photo">
        {photo ? (
          <img src={photo} alt={slot.serviceName} />
        ) : (
          <ImageIcon size={30} />
        )}
      </div>

      <div className="business-slot-details">
        <h3>{slot.serviceName}</h3>

        <p>
          <CalendarDays size={15} />
          {formatDate(slot.startTime)}
        </p>

        <p className="business-slot-spots">
          <Flame size={15} />
          {slot.spotsLeft} spots left
        </p>
      </div>

      <div className="business-slot-prices">
        <del>{money(slot.originalPrice)}</del>
        <strong>{money(slot.dealPrice)}</strong>
      </div>

      <div className="business-slot-actions">
        <button
          type="button"
          className="business-edit-button"
          title="Edit Slot"
          aria-label={`Edit ${slot.serviceName}`}
          onClick={() => onEdit(slot)}
        >
          <Pencil size={18} />
        </button>

        <button
          type="button"
          className="business-delete-button"
          title="Delete Slot"
          aria-label={`Delete ${slot.serviceName}`}
          onClick={() => onDelete(slot)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
}

export default function BusinessSlots() {
  const { user } = useAuth();

  const [slots, setSlots] = useState([]);
  const [filter, setFilter] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editSlot, setEditSlot] = useState(null);
  const [deleteSlot, setDeleteSlot] = useState(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    startTime: "",
    dealPrice: "",
  });

  async function loadSlots() {
    setLoading(true);
    setError("");

    try {
      const data = await api("/slots/mine");

      if (!Array.isArray(data?.slots)) {
        throw new Error("Invalid response from server.");
      }

      setSlots(data.slots);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === "business") {
      loadSlots();
    } else {
      setLoading(false);
    }
  }, [user?.role]);

  const groups = useMemo(() => {
    return {
      active: slots.filter(
        (slot) => getStatus(slot) === "active"
      ),
      upcoming: slots.filter(
        (slot) => getStatus(slot) === "upcoming"
      ),
      past: slots.filter(
        (slot) => getStatus(slot) === "past"
      ),
    };
  }, [slots]);

  const visibleSlots = groups[filter];

  function openEdit(slot) {
    setError("");
    setSuccess("");
    setEditSlot(slot);

    setForm({
      serviceName: slot.serviceName,
      description: slot.description || "",
      startTime: toLocalDateTime(slot.startTime),
      dealPrice: String(slot.dealPrice),
    });
  }

  function changeField(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    if (!editSlot || busy) return;

    setError("");

    const price = Number(form.dealPrice);
    const date = new Date(form.startTime);

    if (
      !form.serviceName.trim() ||
      !Number.isFinite(price) ||
      price <= 0 ||
      price >= editSlot.originalPrice
    ) {
      setError("Please enter valid service details and price.");
      return;
    }

    if (
      !Number.isFinite(date.getTime()) ||
      date.getTime() <= Date.now()
    ) {
      setError("Please select a future date and time.");
      return;
    }

    setBusy(true);

    try {
      const result = await api(`/slots/${editSlot._id}`, {
        method: "PATCH",
        body: {
          serviceName: form.serviceName.trim(),
          description: form.description.trim(),
          startTime: date.toISOString(),
          dealPrice: price,
        },
      });

      if (!result?.slot) {
        throw new Error("Invalid update response.");
      }

      setSlots((previous) =>
        previous.map((slot) =>
          slot._id === editSlot._id ? result.slot : slot
        )
      );

      setEditSlot(null);
      setSuccess("Slot updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!deleteSlot || busy) return;

    setBusy(true);
    setError("");

    try {
      await api(`/slots/${deleteSlot._id}`, {
        method: "DELETE",
      });

      setSlots((previous) =>
        previous.filter(
          (slot) => slot._id !== deleteSlot._id
        )
      );

      setDeleteSlot(null);
      setSuccess("Slot deleted successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (user?.role !== "business") {
    return (
      <main className="business-slots-page">
        <p>Business accounts only.</p>
      </main>
    );
  }

  return (
    <main className="business-slots-page">
      <section className="business-slots-panel">

        <div className="business-slots-header">
          <div className="business-slots-title">
            <CalendarCheck2 size={31} />

            <div>
              <h1>My Slots</h1>
              <p>
                Manage, update or remove your published slots
              </p>
            </div>
          </div>

          <Link
            to="/publish-slot"
            className="business-publish-button"
          >
            <Plus size={18} />
            Publish New Slot
          </Link>
        </div>

        {success && (
          <div className="business-success" role="status">
            {success}
          </div>
        )}

        {error && !editSlot && !deleteSlot && (
          <div className="business-error" role="alert">
            {error}
          </div>
        )}

        <div
          className="business-slot-filters"
          role="group"
          aria-label="Filter business slots"
        >
          {["active", "upcoming", "past"].map((name) => (
            <button
              type="button"
              key={name}
              className={
                filter === name ? "filter selected" : "filter"
              }
              aria-pressed={filter === name}
              onClick={() => setFilter(name)}
            >
              {name[0].toUpperCase() + name.slice(1)}
              {" "}({groups[name].length})
            </button>
          ))}
        </div>

        <div className="business-slot-list">
          {loading ? (
            <p className="business-empty">
              Loading your slots...
            </p>
          ) : visibleSlots.length === 0 ? (
            <p className="business-empty">
              No {filter} slots found.
            </p>
          ) : (
            visibleSlots.map((slot) => (
              <SlotCard
                key={slot._id}
                slot={slot}
                onEdit={openEdit}
                onDelete={(selected) => {
                  setError("");
                  setSuccess("");
                  setDeleteSlot(selected);
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* EDIT POPUP */}

      {editSlot && (
        <div className="business-modal-overlay">
          <div
            className="business-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="business-edit-title"
          >
            <div className="business-modal-heading">
              <div>
                <h2 id="business-edit-title">
                  Edit Business Slot
                </h2>
                <p>Update your published slot information</p>
              </div>

              <button
                type="button"
                className="business-close"
                disabled={busy}
                onClick={() => setEditSlot(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="business-edit-form"
            >
              <label>
                Service Name *
                <input
                  name="serviceName"
                  value={form.serviceName}
                  onChange={changeField}
                  maxLength={120}
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  rows={3}
                  maxLength={2000}
                  value={form.description}
                  onChange={changeField}
                />
              </label>

              <label>
                Date & Time *
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={changeField}
                  required
                />
              </label>

              <div className="business-form-columns">
                <label>
                  Original Price (EGP)
                  <input
                    value={editSlot.originalPrice}
                    disabled
                  />
                </label>

                <label>
                  Deal Price (EGP) *
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    name="dealPrice"
                    value={form.dealPrice}
                    onChange={changeField}
                    required
                  />
                </label>
              </div>

              {error && (
                <p className="business-error" role="alert">
                  {error}
                </p>
              )}

              <div className="business-modal-buttons">
                <button
                  type="button"
                  className="business-cancel-button"
                  disabled={busy}
                  onClick={() => setEditSlot(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="business-save-button"
                  disabled={busy}
                >
                  <Save size={18} />
                  {busy ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}

      {deleteSlot && (
        <div className="business-modal-overlay">
          <div
            className="business-modal business-delete-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="business-delete-title"
            aria-describedby="business-delete-description"
          >
            <div className="business-delete-symbol">
              <Trash2 size={28} />
            </div>

            <h2 id="business-delete-title">
              Delete this slot?
            </h2>

            <p id="business-delete-description">
              Are you sure you want to delete{" "}
              <strong>{deleteSlot.serviceName}</strong>?
              This action cannot be undone.
            </p>

            {error && (
              <p className="business-error" role="alert">
                {error}
              </p>
            )}

            <div className="business-modal-buttons">
              <button
                type="button"
                className="business-cancel-button"
                disabled={busy}
                onClick={() => {
                  setDeleteSlot(null);
                  setError("");
                }}
              >
                Keep Slot
              </button>

              <button
                type="button"
                className="business-confirm-delete"
                disabled={busy}
                onClick={handleDelete}
              >
                {busy ? "Deleting..." : "Delete Slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
