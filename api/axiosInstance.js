// utils/axiosInstance.js
import axios from "axios";

// Create an instance of axios
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor to add the token to the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized error globally
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      // Optionally redirect to login page or show a message
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
