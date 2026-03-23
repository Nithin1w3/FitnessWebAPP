import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  MdDashboard, MdFitnessCenter, MdRestaurantMenu,
  MdPerson, MdLogout,
} from "react-icons/md";
import "./Navbar.css";

const navLinks = [
  { to: "/",         icon: <MdDashboard />,      label: "Dashboard"  },
  { to: "/workouts", icon: <MdFitnessCenter />,   label: "Workouts"   },
  { to: "/calories", icon: <MdRestaurantMenu />,  label: "Calories"   },
  { to: "/profile",  icon: <MdPerson />,          label: "Profile"    },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">⚡</span>
        <span className="logo-text">FITNESS<span>FREAK</span></span>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
        <div className="user-info">
          <p className="user-name">{user?.name}</p>
          <p className="user-role">{user?.isAdmin ? "Admin" : "Member"}</p>
        </div>
      </div>

      <ul className="nav-links">
        {navLinks.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <button className="logout-btn" onClick={handleLogout}>
        <MdLogout /> Logout
      </button>
    </nav>
  );
}
