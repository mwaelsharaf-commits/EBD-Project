import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout title="Welcome Back 👋" subtitle="Log in to your Forsa account">
      <form onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <Field icon={Mail} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <Field icon={Lock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <div className="auth-options">
          <label><input type="checkbox" /> Remember me</label>
          <button type="button" className="link">Forgot password?</button>
        </div>
        <button type="submit" className="btn-primary">Log In <ArrowRight size={18} /></button>
      </form>
    </AuthLayout>
  );
}