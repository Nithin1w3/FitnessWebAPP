const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/users", require("./Routes/userRoutes"));
app.use("/api/workouts", require("./Routes/workoutRoutes"));
app.use("/api/calories", require("./Routes/calorieRoutes"));
app.use("/api/admin", require("./Routes/adminRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "FitnessFreak3x API Running 🏋️" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
