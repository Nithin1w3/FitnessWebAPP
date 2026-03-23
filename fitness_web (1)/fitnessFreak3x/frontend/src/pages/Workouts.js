import { useEffect, useState } from "react";
import { getWorkouts, createWorkout, deleteWorkout, updateWorkout } from "../utils/api";
import toast from "react-hot-toast";
import { MdAdd, MdDelete, MdCheckCircle, MdRadioButtonUnchecked, MdFitnessCenter } from "react-icons/md";
import "./Workouts.css";

const emptyForm = {
  title: "", category: "strength", duration: "", notes: "",
  exercises: [{ name: "", sets: 3, reps: 10, weight: 0, caloriesBurned: 0 }],
};

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchWorkouts = async () => {
    try {
      const { data } = await getWorkouts(filter ? { category: filter } : {});
      setWorkouts(data);
    } catch { toast.error("Failed to load workouts"); }
  };

  useEffect(() => { fetchWorkouts(); }, [filter]);

  const setField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const setExercise = (i, field) => (e) => {
    const exs = [...form.exercises];
    exs[i] = { ...exs[i], [field]: e.target.value };
    setForm({ ...form, exercises: exs });
  };

  const addExercise = () =>
    setForm({ ...form, exercises: [...form.exercises, { name: "", sets: 3, reps: 10, weight: 0, caloriesBurned: 0 }] });

  const removeExercise = (i) =>
    setForm({ ...form, exercises: form.exercises.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const totalCal = form.exercises.reduce((s, ex) => s + Number(ex.caloriesBurned), 0);
      await createWorkout({ ...form, totalCaloriesBurned: totalCal });
      toast.success("Workout logged! 🔥");
      setShowForm(false);
      setForm(emptyForm);
      fetchWorkouts();
    } catch { toast.error("Failed to save workout"); }
    finally { setLoading(false); }
  };

  const toggleComplete = async (w) => {
    try {
      await updateWorkout(w._id, { completed: !w.completed });
      fetchWorkouts();
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout?")) return;
    try {
      await deleteWorkout(id);
      toast.success("Workout deleted");
      fetchWorkouts();
    } catch { toast.error("Delete failed"); }
  };

  const categories = ["", "strength", "cardio", "flexibility", "sports", "other"];

  return (
    <div>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2>Workouts</h2>
          <p>Track and manage your training sessions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <MdAdd style={{ verticalAlign: "middle" }} /> Log Workout
        </button>
      </div>

      {/* Filter */}
      <div className="filter-row">
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-btn ${filter === c ? "active" : ""}`}
            onClick={() => setFilter(c)}
          >
            {c === "" ? "All" : c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Log Workout</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label>Workout Title</label>
                  <input className="form-control" placeholder="e.g. Chest Day" value={form.title} onChange={setField("title")} required />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={form.category} onChange={setField("category")}>
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio</option>
                    <option value="flexibility">Flexibility</option>
                    <option value="sports">Sports</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input type="number" className="form-control" placeholder="60" value={form.duration} onChange={setField("duration")} />
              </div>

              <div className="exercises-section">
                <div className="exercises-header">
                  <label>Exercises</label>
                  <button type="button" className="btn btn-outline" style={{ padding: "4px 12px", fontSize: 13 }} onClick={addExercise}>
                    + Add
                  </button>
                </div>
                {form.exercises.map((ex, i) => (
                  <div key={i} className="exercise-row">
                    <input className="form-control" placeholder="Exercise name" value={ex.name} onChange={setExercise(i, "name")} required />
                    <input type="number" className="form-control" placeholder="Sets" value={ex.sets} onChange={setExercise(i, "sets")} />
                    <input type="number" className="form-control" placeholder="Reps" value={ex.reps} onChange={setExercise(i, "reps")} />
                    <input type="number" className="form-control" placeholder="kg" value={ex.weight} onChange={setExercise(i, "weight")} />
                    <input type="number" className="form-control" placeholder="Cal" value={ex.caloriesBurned} onChange={setExercise(i, "caloriesBurned")} />
                    {form.exercises.length > 1 && (
                      <button type="button" className="btn btn-danger" style={{ padding: "8px 10px" }} onClick={() => removeExercise(i)}>✕</button>
                    )}
                  </div>
                ))}
                <p className="exercise-hint">Sets / Reps / Weight(kg) / Calories</p>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-control" rows={2} placeholder="How did it go?" value={form.notes} onChange={setField("notes")} />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? "Saving..." : "Save Workout"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workout list */}
      {workouts.length === 0 ? (
        <div className="empty-state">
          <MdFitnessCenter />
          <p>No workouts yet. Log your first session!</p>
        </div>
      ) : (
        <div className="workout-list">
          {workouts.map((w) => (
            <div key={w._id} className={`workout-card ${w.completed ? "completed" : ""}`}>
              <div className="workout-card-header">
                <div>
                  <h4>{w.title}</h4>
                  <div className="workout-meta">
                    <span className="badge badge-info">{w.category}</span>
                    <span>{new Date(w.date).toLocaleDateString()}</span>
                    {w.duration > 0 && <span>⏱ {w.duration} min</span>}
                    {w.totalCaloriesBurned > 0 && <span>🔥 {w.totalCaloriesBurned} cal</span>}
                  </div>
                </div>
                <div className="workout-actions">
                  <button className="icon-btn" onClick={() => toggleComplete(w)} title="Toggle complete">
                    {w.completed ? <MdCheckCircle style={{ color: "var(--success)" }} /> : <MdRadioButtonUnchecked />}
                  </button>
                  <button className="icon-btn danger" onClick={() => handleDelete(w._id)}>
                    <MdDelete />
                  </button>
                </div>
              </div>
              {w.exercises.length > 0 && (
                <div className="exercise-pills">
                  {w.exercises.map((ex, i) => (
                    <span key={i} className="exercise-pill">
                      {ex.name} {ex.sets}×{ex.reps}{ex.weight > 0 ? ` @ ${ex.weight}kg` : ""}
                    </span>
                  ))}
                </div>
              )}
              {w.notes && <p className="workout-notes">{w.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
