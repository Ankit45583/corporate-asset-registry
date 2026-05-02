import axios from "axios";

// 🔥 Base URL (Production + Local fallback)
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"; // local backend

// ✅ Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Add token automatically (if exists)
api.interceptors.request.use(
  (config) => {
    try {
      const userData = localStorage.getItem("car_user");

      if (userData) {
        const user = JSON.parse(userData);

        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);

    // Optional: Unauthorized handling
    if (error.response?.status === 401) {
      localStorage.removeItem("car_user");
      // window.location.href = "/login"; // optional redirect
    }

    return Promise.reject(error);
  }
);

export default api;