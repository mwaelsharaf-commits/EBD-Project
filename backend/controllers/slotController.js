
import mongoose from "mongoose";
import Slot from "../models/Slot.js";

// Fields that business owners are allowed to edit
const EDITABLE_FIELDS = [
  "serviceName",
  "description",
  "startTime",
  "dealPrice",
];

// =====================================
// GET BUSINESS SLOTS
// GET /api/slots/mine
// =====================================

export async function getMySlots(req, res) {
  const slots = await Slot.find({
    business: req.user._id,
  }).sort({ startTime: 1 });

  return res.status(200).json({
    slots,
  });
}

// =====================================
// EDIT BUSINESS SLOT
// PATCH /api/slots/:id
// =====================================

export async function updateSlot(req, res) {
  const { id } = req.params;

  // Validate the slot ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      error: "Invalid slot ID.",
    });
  }

  // Find the slot belonging to the logged-in business
  const slot = await Slot.findOne({
    _id: id,
    business: req.user._id,
  });

  if (!slot) {
    return res.status(404).json({
      error: "Slot not found or does not belong to you.",
    });
  }

  const input = req.body;

  // Validate the request body
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return res.status(400).json({
      error: "Invalid update request.",
    });
  }

  const fields = Object.keys(input);

  // Only permit the four fields in Use Case 3
  if (
    fields.length === 0 ||
    fields.some(
      (field) => !EDITABLE_FIELDS.includes(field)
    )
  ) {
    return res.status(400).json({
      error: "One or more fields cannot be edited.",
    });
  }

  // =====================================
  // VALIDATE SERVICE NAME
  // =====================================

  if ("serviceName" in input) {
    if (
      typeof input.serviceName !== "string" ||
      !input.serviceName.trim() ||
      input.serviceName.length > 120
    ) {
      return res.status(400).json({
        error: "Please enter a valid service name.",
      });
    }

    slot.serviceName = input.serviceName.trim();
  }

  // =====================================
  // VALIDATE DESCRIPTION
  // =====================================

  if ("description" in input) {
    if (
      typeof input.description !== "string" ||
      input.description.length > 2000
    ) {
      return res.status(400).json({
        error: "Description must be valid text.",
      });
    }

    slot.description = input.description.trim();
  }

  // =====================================
  // VALIDATE DATE AND TIME
  // =====================================

  if ("startTime" in input) {
    if (
      typeof input.startTime !== "string" ||
      !input.startTime.trim()
    ) {
      return res.status(400).json({
        error: "Date and time are required.",
      });
    }

    const newDate = new Date(input.startTime);

    if (
      !Number.isFinite(newDate.getTime()) ||
      newDate.getTime() <= Date.now()
    ) {
      return res.status(400).json({
        error: "Please choose a valid future date and time.",
      });
    }

    slot.startTime = newDate;
  }

  // =====================================
  // VALIDATE DISCOUNTED PRICE
  // =====================================

  if ("dealPrice" in input) {
    const price = input.dealPrice;

    if (
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price <= 0 ||
      price >= slot.originalPrice
    ) {
      return res.status(400).json({
        error:
          "Deal price must be greater than zero and lower than the original price.",
      });
    }

    slot.dealPrice = price;
  }

  // =====================================
  // SAVE CHANGES TO MONGODB
  // =====================================

  await slot.save();

  return res.status(200).json({
    message: "Slot updated successfully.",
    slot,
  });
}

// =====================================
// DELETE BUSINESS SLOT
// DELETE /api/slots/:id
// =====================================

export async function deleteSlot(req, res) {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      error: "Invalid slot ID.",
    });
  }

  // Check that the business owns this slot
  const slot = await Slot.findOne({
    _id: id,
    business: req.user._id,
  });

  if (!slot) {
    return res.status(404).json({
      error: "Slot not found or does not belong to you.",
    });
  }

  // =====================================
  // CHECK EXISTING BOOKINGS
  // =====================================

  // The Booking model in the project README
  // links a booking to a slot through "slot".
  // Mongoose normally uses the "bookings" collection.

  const bookingCount = await mongoose.connection
    .collection("bookings")
    .countDocuments({
      slot: slot._id,
    });

  // Prevent deleting a booked slot
  if (
    bookingCount > 0 ||
    slot.spotsLeft !== slot.totalSpots
  ) {
    return res.status(409).json({
      error:
        "This slot has bookings and cannot be deleted.",
    });
  }

  // =====================================
  // DELETE FROM MONGODB
  // =====================================

  const deleted = await Slot.findOneAndDelete({
    _id: slot._id,
    business: req.user._id,
    spotsLeft: slot.totalSpots,
  });

  if (!deleted) {
    return res.status(409).json({
      error:
        "This slot has changed. Please refresh and try again.",
    });
  }

  return res.status(200).json({
    message: "Slot deleted successfully.",
    id: slot._id,
  });
}
