import axios from "axios";

export const api = axios.create({
  baseURL: process.env.BACKEND_BASE_URL || "localhost:8000",
});

// Optional: auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

