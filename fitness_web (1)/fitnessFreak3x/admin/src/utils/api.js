import axios from "axios";

const API = axios.create({ baseURL: "/api" });

API.interceptors.request.use((config) => {
  const info = localStorage.getItem("adminInfo");
  if (info) {
    const { token } = JSON.parse(info);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminLogin       = (data) => API.post("/auth/login", data);
export const getAdminStats    = ()     => API.get("/admin/stats");
export const getAdminUsers    = ()     => API.get("/admin/users");
export const toggleUser       = (id)   => API.put(`/admin/users/${id}/toggle`);
export const deleteUser       = (id)   => API.delete(`/admin/users/${id}`);
export const getAllWorkouts    = ()     => API.get("/workouts");
export const getAllCalories    = ()     => API.get("/calories");

export default API;
