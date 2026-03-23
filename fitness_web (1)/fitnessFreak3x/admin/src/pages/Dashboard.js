import { useEffect, useState } from "react";
import { getAdminStats, getAdminUsers } from "../utils/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import {
  MdPeople, MdFitnessCenter, MdRestaurantMenu,
  MdCheckCircle, MdTrendingUp
} from "react-icons/md";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminUsers()])
      .then(([s, u]) => {
        setStats(s.data);
        setUsers(u.data.slice(0, 5)); // latest 5
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
        { label: "Total Users",    value: stats.totalUsers,    icon: <MdPeople />,         color: "var(--primary)", bg: "rgba(232,255,0,0.1)"  },
        { label: "Active Users",   value: stats.activeUsers,   icon: <MdCheckCircle />,    color: "var(--success)", bg: "rgba(0,230,118,0.1)"  },
        { label: "Total Workouts", value: stats.totalWorkouts, icon: <MdFitnessCenter />,  color: "var(--info)",    bg: "rgba(0,188,212,0.1)"  },
        { label: "Meal Logs",      value: stats.totalLogs,     icon: <MdRestaurantMenu />, color: "var(--warning)", bg: "rgba(255,170,0,0.1)"  },
      ]
    : [];

  const chartData = users.map((u) => ({
    name: u.name.split(" ")[0],
    goal: u.goal ? u.goal.replace("_", " ") : "N/A",
  }));

  const goalDistribution = users.reduce((acc, u) => {
    const g = u.goal || "unknown";
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});

  const goalChart = Object.entries(goalDistribution).map(([k, v]) => ({
    name: k.replace("_", " "),
    count: v,
  }));

  const COLORS = ["var(--primary)", "var(--success)", "var(--info)", "var(--warning)", "var(--danger)"];

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard Overview</h2>
        <p>Platform-wide statistics and activity</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="stat-label">{s.label}</p>
              <h3 className="stat-value">{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-bottom">
        {/* Goal Distribution Chart */}
        <div className="card">
          <h3 className="section-title"><MdTrendingUp /> User Goals</h3>
          {goalChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={goalChart} barSize={32}>
                <XAxis dataKey="name" tick={{ fill: "#777", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: "#1a1a1a", border: "1px solid #252525", borderRadius: 8 }}
                  labelStyle={{ color: "#f0f0f0" }}
                  itemStyle={{ color: "#e8ff00" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {goalChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="no-data">No user data yet</p>
          )}
        </div>

        {/* Recent Users */}
        <div className="card">
          <h3 className="section-title"><MdPeople /> Recent Users</h3>
          {users.length === 0 ? (
            <p className="no-data">No users registered yet</p>
          ) : (
            <table className="mini-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Goal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-mini-avatar">{u.name.charAt(0)}</div>
                        <div>
                          <p>{u.name}</p>
                          <p className="mini-email">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-info">
                        {(u.goal || "N/A").replace("_", " ")}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? "badge-success" : "badge-danger"}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
