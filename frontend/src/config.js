// Detect if running on localhost / local development
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
   window.location.hostname === "127.0.0.1");

const defaultApiUrl = isLocal
  ? "http://localhost:5000/api"
  : "https://bigmall-backend.onrender.com/api";

const defaultFrontendUrl = isLocal
  ? "http://localhost:5173"
  : "https://bigmall-frontend-sage.vercel.app";

const defaultDashboardUrl = isLocal
  ? "http://localhost:5174"
  : "https://bigmall-dashboard.vercel.app";

const rawApiUrl = (import.meta.env.VITE_API_URL || defaultApiUrl)
  .trim()
  .replace(/\/+$/, "");

export const API_URL = rawApiUrl.endsWith("/api") ? rawApiUrl : `${rawApiUrl}/api`;
export const FILE_URL = API_URL.replace(/\/api$/, "");

export const FRONTEND_URL =
  import.meta.env.VITE_FRONTEND_URL || defaultFrontendUrl;

export const DASHBOARD_URL =
  import.meta.env.VITE_DASHBOARD_URL || defaultDashboardUrl;
