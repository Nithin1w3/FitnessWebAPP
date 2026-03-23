import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MdDashboard, MdPeople, MdLogout, MdAdminPanelSettings } from "react-icons/md";
import "./Sidebar.css";

const links = [
  { to: "/",      icon: <MdDashboard />, label: "Dashboard", end: true },
  { to: "/users", icon: <MdPeople />,    label: "Users"               },
];

export default function Sidebar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <MdAdminPanelSettings className="logo-icon" />
        <div>
          <p className="logo-title">FITNESSFREAK</p>
          <p className="logo-sub">Admin Panel</p>
        </div>
      </div>

      <div className="admin-badge">
        <div className="admin-dot" />
        <div>
          <p className="admin-name">{admin?.name}</p>
          <p className="admin-role">Super Admin</p>
        </div>
      </div>

      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.to}>
            <NavLink
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button className="logout-btn" onClick={() => { logout(); navigate("/login"); }}>
        <MdLogout /> Logout
      </button>
    </nav>
  );
}
