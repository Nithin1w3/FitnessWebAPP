import { useEffect, useState } from "react";
import { getAdminUsers, toggleUser, deleteUser } from "../utils/api";
import toast from "react-hot-toast";
import { MdPeople, MdDelete, MdBlock, MdCheckCircle, MdSearch } from "react-icons/md";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await getAdminUsers();
      setUsers(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  const handleToggle = async (id) => {
    try {
      const { data } = await toggleUser(id);
      toast.success(data.message);
      fetchUsers();
    } catch {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const goalLabel = (g) => (g ? g.replace("_", " ") : "—");
  const activityLabel = (a) => (a ? a.charAt(0).toUpperCase() + a.slice(1) : "—");

  const totalActive = users.filter((u) => u.isActive).length;
  const totalInactive = users.length - totalActive;

  return (
    <div>
      <div className="page-header">
        <h2>User Management</h2>
        <p>View, activate, or remove registered users</p>
      </div>

      {/* Summary pills */}
      <div className="user-summary">
        <div className="summary-pill">
          <MdPeople /> <strong>{users.length}</strong> Total
        </div>
        <div className="summary-pill success">
          <MdCheckCircle /> <strong>{totalActive}</strong> Active
        </div>
        <div className="summary-pill danger">
          <MdBlock /> <strong>{totalInactive}</strong> Inactive
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <MdSearch className="search-icon" />
        <input
          className="search-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading users...</p>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <MdPeople />
          <p>{search ? "No users match your search" : "No users registered yet"}</p>
        </div>
      ) : (
        <div className="card table-card">
          <table className="users-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Goal</th>
                <th>Activity</th>
                <th>BMI Info</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{u.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <p className="user-name">{u.name}</p>
                        <p className="user-email">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-info" style={{ fontSize: 11 }}>
                      {goalLabel(u.goal)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {activityLabel(u.activityLevel)}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {u.height ? `${u.height}cm` : "—"} / {u.weight ? `${u.weight}kg` : "—"}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`badge ${u.isActive ? "badge-success" : "badge-danger"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button
                        className={`btn btn-sm ${u.isActive ? "btn-warning" : "btn-success-outline"}`}
                        onClick={() => handleToggle(u._id)}
                        title={u.isActive ? "Deactivate" : "Activate"}
                      >
                        {u.isActive ? <MdBlock /> : <MdCheckCircle />}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(u._id, u.name)}
                        title="Delete user"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
