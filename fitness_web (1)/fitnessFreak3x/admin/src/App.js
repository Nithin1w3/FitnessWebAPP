import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  return admin ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { admin } = useAuth();
  return admin ? <Navigate to="/" /> : children;
};

const Layout = () => {
  const { admin } = useAuth();
  return (
    <div className="app-layout">
      {admin && <Sidebar />}
      <main className={admin ? "main-content" : "main-auth"}>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/"      element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
          <Route path="*"      element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#1a1a1a", color: "#f0f0f0", border: "1px solid #2a2a2a" },
          }}
        />
        <Layout />
      </Router>
    </AuthProvider>
  );
}
