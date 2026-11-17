import { useAuth } from "../context/AuthContext";

// Placeholder: customers will see the deals, businesses their dashboard
export default function Home() {
  const { user } = useAuth();
  return (
    <main className="page">
      <h1>{user.role === "business" ? "Dashboard" : "Deals"}</h1>
    </main>
  );
}