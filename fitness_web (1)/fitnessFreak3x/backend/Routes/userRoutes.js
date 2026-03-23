const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const { protect } = require("../Middlewares/authMiddleware");

// @GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @PUT /api/users/profile
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, age, gender, height, weight, goal, activityLevel, profilePic } = req.body;

    user.name = name || user.name;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.goal = goal || user.goal;
    user.activityLevel = activityLevel || user.activityLevel;
    user.profilePic = profilePic || user.profilePic;

    if (req.body.password) user.password = req.body.password;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      age: updated.age,
      gender: updated.gender,
      height: updated.height,
      weight: updated.weight,
      goal: updated.goal,
      activityLevel: updated.activityLevel,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @GET /api/users/bmi  — calculate BMI
router.get("/bmi", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.height || !user.weight) {
      return res.status(400).json({ message: "Height and weight required" });
    }
    const heightM = user.height / 100;
    const bmi = (user.weight / (heightM * heightM)).toFixed(1);
    let category = "";
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    res.json({ bmi: parseFloat(bmi), category });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
