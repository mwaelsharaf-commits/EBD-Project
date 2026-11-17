import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Users, Store, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "customer", businessName: "",
  });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout title="Create Account" subtitle="Join Forsa and grab last-minute deals">
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <Field icon={User} name="name" placeholder="Full name" value={form.name} onChange={handleChange} required />
        <Field icon={Mail} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <Field icon={Lock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <div className="field">
          <Users size={18} />
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="customer">I'm a customer</option>
            <option value="business">I'm a business</option>
          </select>
        </div>
        {form.role === "business" && (
          <Field icon={Store} name="businessName" placeholder="Business name" value={form.businessName} onChange={handleChange} required />
        )}
        <button type="submit" className="btn-primary">Create Account <ArrowRight size={18} /></button>
      </form>
    </AuthLayout>
  );
}