import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getWorkoutStats, getDailySummary, getBMI } from "../utils/api";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { MdLocalFire, MdFitnessCenter, MdTimer, MdRestaurantMenu } from "react-icons/md";
import "./Dashboard.css";

const weekData = [
  { day: "Mon", calories: 320 },
  { day: "Tue", calories: 540 },
  { day: "Wed", calories: 280 },
  { day: "Thu", calories: 610 },
  { day: "Fri", calories: 420 },
  { day: "Sat", calories: 750 },
  { day: "Sun", calories: 390 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [dailySummary, setDailySummary] = useState(null);
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    getWorkoutStats().then((r) => setStats(r.data)).catch(() => {});
    getDailySummary().then((r) => setDailySummary(r.data)).catch(() => {});
    getBMI().then((r) => setBmi(r.data)).catch(() => {});
  }, []);

  const getBmiColor = (bmi) => {
    if (!bmi) return "var(--text-muted)";
    if (bmi < 18.5) return "var(--info)";
    if (bmi < 25) return "var(--success)";
    if (bmi < 30) return "var(--warning)";
    return "var(--danger)";
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
        <p>Here's your fitness overview for today</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(232,255,0,0.1)", color: "var(--primary)" }}>
            <MdLocalFire />
          </div>
          <div>
            <p className="stat-label">Calories Burned</p>
            <h3 className="stat-value">{stats?.totalCalories ?? "--"}</h3>
            <p className="stat-sub">Last 30 days</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(0,230,118,0.1)", color: "var(--success)" }}>
            <MdFitnessCenter />
          </div>
          <div>
            <p className="stat-label">Workouts</p>
            <h3 className="stat-value">{stats?.totalWorkouts ?? "--"}</h3>
            <p className="stat-sub">Last 30 days</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(0,188,212,0.1)", color: "var(--info)" }}>
            <MdTimer />
          </div>
          <div>
            <p className="stat-label">Active Minutes</p>
            <h3 className="stat-value">{stats?.totalMinutes ?? "--"}</h3>
            <p className="stat-sub">Last 30 days</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "rgba(255,170,0,0.1)", color: "var(--warning)" }}>
            <MdRestaurantMenu />
          </div>
          <div>
            <p className="stat-label">Calories Today</p>
            <h3 className="stat-value">{dailySummary?.totalCalories ?? "--"}</h3>
            <p className="stat-sub">{dailySummary?.meals ?? 0} meals logged</p>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        {/* Weekly Chart */}
        <div className="card chart-card">
          <h3>Weekly Calories Burned</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e8ff00" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e8ff00" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8 }}
                labelStyle={{ color: "#f0f0f0" }}
                itemStyle={{ color: "#e8ff00" }}
              />
              <Area type="monotone" dataKey="calories" stroke="#e8ff00" strokeWidth={2} fill="url(#colorCal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right panel */}
        <div className="dashboard-right">
          {/* BMI Card */}
          <div className="card bmi-card">
            <h3>BMI Score</h3>
            {bmi ? (
              <>
                <div className="bmi-score" style={{ color: getBmiColor(bmi.bmi) }}>
                  {bmi.bmi}
                </div>
                <span className={`badge badge-${bmi.category === "Normal" ? "success" : bmi.category === "Overweight" ? "warning" : "danger"}`}>
                  {bmi.category}
                </span>
              </>
            ) : (
              <p className="text-muted-sm">Add height & weight in Profile to see BMI</p>
            )}
          </div>

          {/* Today's Macros */}
          <div className="card macros-card">
            <h3>Today's Macros</h3>
            {dailySummary ? (
              <div className="macros-list">
                <MacroBar label="Protein" value={dailySummary.totalProtein} max={150} color="var(--success)" unit="g" />
                <MacroBar label="Carbs"   value={dailySummary.totalCarbs}   max={300} color="var(--warning)" unit="g" />
                <MacroBar label="Fat"     value={dailySummary.totalFat}     max={80}  color="var(--danger)"  unit="g" />
              </div>
            ) : (
              <p className="text-muted-sm">No meals logged today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroBar({ label, value, max, color, unit }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="macro-bar">
      <div className="macro-label-row">
        <span>{label}</span>
        <span style={{ color }}>{value}{unit}</span>
      </div>
      <div className="macro-track">
        <div className="macro-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
