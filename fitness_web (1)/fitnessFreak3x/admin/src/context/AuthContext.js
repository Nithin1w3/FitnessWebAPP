import { createContext, useContext, useState, useEffect } from "react";
import { adminLogin } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("adminInfo");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.isAdmin) setAdmin(parsed);
      else localStorage.removeItem("adminInfo");
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await adminLogin({ email, password });
    if (!data.isAdmin) throw new Error("Not an admin account");
    localStorage.setItem("adminInfo", JSON.stringify(data));
    setAdmin(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("adminInfo");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
