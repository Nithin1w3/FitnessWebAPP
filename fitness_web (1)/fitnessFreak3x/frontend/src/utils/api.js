import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// Users
export const getProfile = () => API.get("/users/profile");
export const updateProfile = (data) => API.put("/users/profile", data);
export const getBMI = () => API.get("/users/bmi");

// Workouts
export const getWorkouts = (params) => API.get("/workouts", { params });
export const createWorkout = (data) => API.post("/workouts", data);
export const updateWorkout = (id, data) => API.put(`/workouts/${id}`, data);
export const deleteWorkout = (id) => API.delete(`/workouts/${id}`);
export const getWorkoutStats = () => API.get("/workouts/stats/summary");

// Calories
export const getCalorieLogs = (params) => API.get("/calories", { params });
export const addCalorieLog = (data) => API.post("/calories", data);
export const updateCalorieLog = (id, data) => API.put(`/calories/${id}`, data);
export const deleteCalorieLog = (id) => API.delete(`/calories/${id}`);
export const getDailySummary = () => API.get("/calories/daily-summary");

// Admin
export const getAdminStats = () => API.get("/admin/stats");
export const getAdminUsers = () => API.get("/admin/users");
export const toggleUserStatus = (id) => API.put(`/admin/users/${id}/toggle`);
export const deleteAdminUser = (id) => API.delete(`/admin/users/${id}`);

export default API;
