import axios from "axios";

// Detect if running on localhost / local development
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
   window.location.hostname === "127.0.0.1");

// Determine the default base URL based on environment
const defaultApiUrl = isLocal
  ? "http://localhost:5000/api"
  : "https://bigmall-backend.onrender.com/api";

const baseURL = (() => {
  const envUrl = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");
  let chosen = defaultApiUrl;
  if (isLocal) {
    if (envUrl && !envUrl.includes("onrender.com")) {
      chosen = envUrl;
    } else {
      chosen = "http://localhost:5000/api";
    }
  } else if (envUrl) {
    chosen = envUrl;
  }
  return chosen.endsWith("/api") ? chosen : `${chosen}/api`;
})();

const API = axios.create({
  baseURL,
});

// all request in token automatically send interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
