/**
 * Run this once to create the first admin user:
 * node seed.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./db");
const User = require("./Models/User");

const seed = async () => {
  await connectDB();

  const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (existing) {
    console.log("Admin already exists:", existing.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: "Admin",
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    isAdmin: true,
  });

  console.log("✅ Admin created:", admin.email);
  console.log("   Password:", process.env.ADMIN_PASSWORD);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
