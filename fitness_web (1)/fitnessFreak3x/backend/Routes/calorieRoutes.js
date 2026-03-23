const express = require("express");
const router = express.Router();
const CalorieLog = require("../Models/CalorieLog");
const { protect } = require("../Middlewares/authMiddleware");

// @GET /api/calories — Get logs (optionally by date)
router.get("/", protect, async (req, res) => {
  try {
    const { date } = req.query;
    let query = { user: req.user._id };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    const logs = await CalorieLog.find(query).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @POST /api/calories — Add meal log
router.post("/", protect, async (req, res) => {
  try {
    const log = await CalorieLog.create({ ...req.body, user: req.user._id });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @PUT /api/calories/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const log = await CalorieLog.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!log) return res.status(404).json({ message: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @DELETE /api/calories/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const log = await CalorieLog.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!log) return res.status(404).json({ message: "Log not found" });
    res.json({ message: "Log deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/calories/daily-summary — Today's totals
router.get("/daily-summary", protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const logs = await CalorieLog.find({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    const summary = {
      totalCalories: logs.reduce((s, l) => s + l.totalCalories, 0),
      totalProtein: logs.reduce((s, l) => s + l.totalProtein, 0),
      totalCarbs: logs.reduce((s, l) => s + l.totalCarbs, 0),
      totalFat: logs.reduce((s, l) => s + l.totalFat, 0),
      meals: logs.length,
    };
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
