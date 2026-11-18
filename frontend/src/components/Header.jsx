import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="header">
<Link to="/" className="logo" id="project-name">Forsa</Link>      {user && (
        <div className="header-user">
          <span>{user.businessName || user.name}</span>
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </header>
  );
}