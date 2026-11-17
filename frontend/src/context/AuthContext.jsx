import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session on page refresh
  useEffect(() => {
    if (!localStorage.getItem("token")) return setLoading(false);
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  async function authenticate(path, body) {
    const data = await api(path, { method: "POST", body });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  }

  const login = (body) => authenticate("/auth/login", body);
  const register = (body) => authenticate("/auth/register", body);

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);