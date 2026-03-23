const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, default: 1 },
  reps: { type: Number, default: 10 },
  weight: { type: Number, default: 0 }, // kg
  duration: { type: Number, default: 0 }, // minutes
  caloriesBurned: { type: Number, default: 0 },
  notes: { type: String, default: "" },
});

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "sports", "other"],
      default: "strength",
    },
    exercises: [exerciseSchema],
    totalCaloriesBurned: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // minutes
    date: { type: Date, default: Date.now },
    notes: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
