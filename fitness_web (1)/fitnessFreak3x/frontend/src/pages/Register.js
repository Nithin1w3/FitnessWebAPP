import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import "./Auth.css";

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    age: "", gender: "", height: "", weight: "",
    goal: "maintain", activityLevel: "moderate",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created! Let's get fit 💪");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">
          <span>⚡</span>
          <h1>FITNESS<span>FREAK</span></h1>
        </div>
        <h2>Create Account</h2>
        <div className="step-indicator">
          <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input className="form-control" placeholder="John Doe" value={form.name} onChange={set("name")} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" className="form-control" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Min 6 characters" value={form.password} onChange={set("password")} required minLength={6} />
              </div>
              <button type="button" className="btn btn-primary auth-btn" onClick={() => setStep(2)}>
                Next →
              </button>
            </>
          )}

          {step === 2 && (
            <>
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
                  <option value="sedentary">Sedentary (little/no exercise)</option>
                  <option value="light">Light (1-3 days/week)</option>
                  <option value="moderate">Moderate (3-5 days/week)</option>
                  <option value="active">Active (6-7 days/week)</option>
                  <option value="very_active">Very Active (twice/day)</option>
                </select>
              </div>
              <div className="auth-btn-row">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </>
          )}
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
