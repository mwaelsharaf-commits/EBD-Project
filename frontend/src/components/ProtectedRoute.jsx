import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages that need a logged-in user redirect to the login page
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}