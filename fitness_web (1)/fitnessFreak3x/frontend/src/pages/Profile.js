import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile, getBMI } from "../utils/api";
import toast from "react-hot-toast";
import "./Profile.css";

export default function Profile() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: "", age: "", gender: "", height: "", weight: "",
    goal: "maintain", activityLevel: "moderate", password: "",
  });
  const [bmi, setBmi] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfile().then(({ data }) => {
      setForm({
        name: data.name || "",
        age: data.age || "",
        gender: data.gender || "",
        height: data.height || "",
        weight: data.weight || "",
        goal: data.goal || "maintain",
        activityLevel: data.activityLevel || "moderate",
        password: "",
      });
    });
    getBMI().then(({ data }) => setBmi(data)).catch(() => {});
  }, []);

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await updateProfile(payload);
      toast.success("Profile updated!");
      getBMI().then(({ data }) => setBmi(data)).catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const goalLabels = {
    lose_weight: "Lose Weight", gain_muscle: "Gain Muscle",
    maintain: "Maintain Weight", improve_fitness: "Improve Fitness",
  };

  const getBmiColor = (b) => {
    if (!b) return "var(--text-muted)";
    if (b < 18.5) return "var(--info)";
    if (b < 25) return "var(--success)";
    if (b < 30) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profile</h2>
        <p>Manage your personal information and goals</p>
      </div>

      <div className="profile-layout">
        {/* Left: Form */}
        <div className="profile-form-section">
          <form className="card" onSubmit={handleSubmit}>
            <h3>Personal Details</h3>

            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" value={form.name} onChange={set("name")} required />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Age</label>
                <input type="number" className="form-control" placeholder="25" value={form.age} onChange={set("age")} />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select className="form-control" value={form.gender} onChange={set("gender")}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Height (cm)</label>
                <input type="number" className="form-control" placeholder="175" value={form.height} onChange={set("height")} />
              </div>
              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" className="form-control" placeholder="70" value={form.weight} onChange={set("weight")} />
              </div>
            </div>

            <div className="form-group">
              <label>Fitness Goal</label>
              <select className="form-control" value={form.goal} onChange={set("goal")}>
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_muscle">Gain Muscle</option>
                <option value="maintain">Maintain Weight</option>
                <option value="improve_fitness">Improve Fitness</option>
              </select>
            </div>

            <div className="form-group">
              <label>Activity Level</label>
              <select className="form-control" value={form.activityLevel} onChange={set("activityLevel")}>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>

            <div className="form-group">
              <label>New Password (leave blank to keep current)</label>
              <input type="password" className="form-control" placeholder="••••••••" value={form.password} onChange={set("password")} minLength={6} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "12px" }} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Right: Stats */}
        <div className="profile-stats-section">
          {/* Avatar */}
          <div className="card profile-avatar-card">
            <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <h3>{user?.name}</h3>
            <p className="user-email">{user?.email}</p>
            {form.goal && <span className="badge badge-info">{goalLabels[form.goal]}</span>}
          </div>

          {/* BMI */}
          {bmi && (
            <div className="card bmi-card-profile">
              <h4>BMI Score</h4>
              <div className="bmi-big" style={{ color: getBmiColor(bmi.bmi) }}>{bmi.bmi}</div>
              <span className={`badge badge-${bmi.category === "Normal" ? "success" : bmi.category === "Overweight" ? "warning" : "danger"}`}>
                {bmi.category}
              </span>
              <div className="bmi-details">
                <div><span>Height</span><strong>{form.height} cm</strong></div>
                <div><span>Weight</span><strong>{form.weight} kg</strong></div>
              </div>
            </div>
          )}

          {/* Quick stats */}
          <div className="card">
            <h4>Account Info</h4>
            <div className="account-info">
              <div><span>Email</span><strong>{user?.email}</strong></div>
              <div><span>Role</span><strong>{user?.isAdmin ? "Admin" : "Member"}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
