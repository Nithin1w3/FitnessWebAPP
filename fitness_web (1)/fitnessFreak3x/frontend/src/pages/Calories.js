import { useEffect, useState } from "react";
import { getCalorieLogs, addCalorieLog, deleteCalorieLog, getDailySummary } from "../utils/api";
import toast from "react-hot-toast";
import { MdAdd, MdDelete, MdRestaurantMenu } from "react-icons/md";
import "./Calories.css";

const emptyFood = { name: "", quantity: 100, unit: "g", calories: 0, protein: 0, carbs: 0, fat: 0 };
const emptyForm = { mealType: "breakfast", notes: "", foods: [{ ...emptyFood }] };

export default function Calories() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const fetchLogs = async () => {
    try {
      const { data } = await getCalorieLogs({ date });
      setLogs(data);
    } catch { toast.error("Failed to load logs"); }
  };

  const fetchSummary = async () => {
    try {
      const { data } = await getDailySummary();
      setSummary(data);
    } catch {}
  };

  useEffect(() => { fetchLogs(); fetchSummary(); }, [date]);

  const setFood = (i, field) => (e) => {
    const foods = [...form.foods];
    foods[i] = { ...foods[i], [field]: e.target.value };
    setForm({ ...form, foods });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCalorieLog(form);
      toast.success("Meal logged! 🥗");
      setShowForm(false);
      setForm(emptyForm);
      fetchLogs();
      fetchSummary();
    } catch { toast.error("Failed to save meal"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this meal?")) return;
    try {
      await deleteCalorieLog(id);
      toast.success("Meal deleted");
      fetchLogs();
      fetchSummary();
    } catch { toast.error("Delete failed"); }
  };

  const CALORIE_GOAL = 2000;
  const calPct = summary ? Math.min((summary.totalCalories / CALORIE_GOAL) * 100, 100) : 0;

  const mealColors = {
    breakfast: "var(--warning)",
    lunch: "var(--success)",
    dinner: "var(--info)",
    snack: "var(--primary)",
  };

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Calorie Tracker</h2>
          <p>Monitor your daily nutrition intake</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <MdAdd style={{ verticalAlign: "middle" }} /> Log Meal
        </button>
      </div>

      {/* Summary */}
      {summary && (
        <div className="calorie-summary card">
          <div className="summary-goal">
            <span>Daily Calories</span>
            <span><strong style={{ color: "var(--primary)" }}>{summary.totalCalories}</strong> / {CALORIE_GOAL} kcal</span>
          </div>
          <div className="goal-track">
            <div className="goal-fill" style={{ width: `${calPct}%`, background: calPct > 100 ? "var(--danger)" : "var(--primary)" }} />
          </div>
          <div className="macro-summary">
            <div className="macro-chip"><span>Protein</span><strong>{summary.totalProtein}g</strong></div>
            <div className="macro-chip"><span>Carbs</span><strong>{summary.totalCarbs}g</strong></div>
            <div className="macro-chip"><span>Fat</span><strong>{summary.totalFat}g</strong></div>
          </div>
        </div>
      )}

      {/* Date picker */}
      <div className="date-row">
        <input
          type="date"
          className="form-control"
          style={{ width: "auto" }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Meal list */}
      {logs.length === 0 ? (
        <div className="empty-state">
          <MdRestaurantMenu />
          <p>No meals logged for this day</p>
        </div>
      ) : (
        <div className="meal-list">
          {logs.map((log) => (
            <div key={log._id} className="meal-card card">
              <div className="meal-header">
                <div className="meal-type-badge" style={{ background: `${mealColors[log.mealType]}20`, color: mealColors[log.mealType] }}>
                  {log.mealType.charAt(0).toUpperCase() + log.mealType.slice(1)}
                </div>
                <div className="meal-stats">
                  <span>🔥 {log.totalCalories} kcal</span>
                  <span>P: {log.totalProtein}g</span>
                  <span>C: {log.totalCarbs}g</span>
                  <span>F: {log.totalFat}g</span>
                </div>
                <button className="icon-btn danger" onClick={() => handleDelete(log._id)}>
                  <MdDelete />
                </button>
              </div>
              <table className="food-table">
                <thead>
                  <tr><th>Food</th><th>Qty</th><th>Cal</th><th>P</th><th>C</th><th>F</th></tr>
                </thead>
                <tbody>
                  {log.foods.map((f, i) => (
                    <tr key={i}>
                      <td>{f.name}</td>
                      <td>{f.quantity}{f.unit}</td>
                      <td>{f.calories}</td>
                      <td>{f.protein}g</td>
                      <td>{f.carbs}g</td>
                      <td>{f.fat}g</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {log.notes && <p className="meal-notes">{log.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add Meal Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Log Meal</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Meal Type</label>
                <select className="form-control" value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div className="exercises-section">
                <div className="exercises-header">
                  <label>Food Items</label>
                  <button type="button" className="btn btn-outline" style={{ padding: "4px 12px", fontSize: 13 }}
                    onClick={() => setForm({ ...form, foods: [...form.foods, { ...emptyFood }] })}>
                    + Add Food
                  </button>
                </div>
                <div className="food-header-row">
                  <span>Name</span><span>Qty</span><span>Cal</span><span>Protein</span><span>Carbs</span><span>Fat</span>
                </div>
                {form.foods.map((f, i) => (
                  <div key={i} className="exercise-row">
                    <input className="form-control" placeholder="e.g. Rice" value={f.name} onChange={setFood(i, "name")} required />
                    <input type="number" className="form-control" placeholder="100g" value={f.quantity} onChange={setFood(i, "quantity")} />
                    <input type="number" className="form-control" placeholder="Cal" value={f.calories} onChange={setFood(i, "calories")} />
                    <input type="number" className="form-control" placeholder="P" value={f.protein} onChange={setFood(i, "protein")} />
                    <input type="number" className="form-control" placeholder="C" value={f.carbs} onChange={setFood(i, "carbs")} />
                    <input type="number" className="form-control" placeholder="F" value={f.fat} onChange={setFood(i, "fat")} />
                    {form.foods.length > 1 && (
                      <button type="button" className="btn btn-danger" style={{ padding: "8px 10px" }}
                        onClick={() => setForm({ ...form, foods: form.foods.filter((_, idx) => idx !== i) })}>✕</button>
                    )}
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Meal"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
