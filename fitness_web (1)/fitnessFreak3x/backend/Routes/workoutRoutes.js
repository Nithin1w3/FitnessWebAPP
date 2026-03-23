const express = require("express");
const router = express.Router();
const Workout = require("../Models/Workout");
const { protect } = require("../Middlewares/authMiddleware");

// @GET /api/workouts — Get all workouts for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const { date, category } = req.query;
    let query = { user: req.user._id };
    if (category) query.category = category;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    const workouts = await Workout.find(query).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/workouts — Create workout
router.post("/", protect, async (req, res) => {
  try {
    const workout = await Workout.create({ ...req.body, user: req.user._id });
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @GET /api/workouts/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/workouts/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @DELETE /api/workouts/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/workouts/stats/summary — Weekly/monthly stats
router.get("/stats/summary", protect, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const workouts = await Workout.find({
      user: req.user._id,
      date: { $gte: thirtyDaysAgo },
    });

    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((s, w) => s + w.totalCaloriesBurned, 0);
    const totalMinutes = workouts.reduce((s, w) => s + w.duration, 0);
    const completed = workouts.filter((w) => w.completed).length;

    res.json({ totalWorkouts, totalCalories, totalMinutes, completed });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
