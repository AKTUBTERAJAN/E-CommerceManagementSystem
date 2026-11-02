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

export const API_URL = (() => {
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

export const FRONTEND_URL = (() => {
  const envUrl = (import.meta.env.VITE_FRONTEND_URL || "").trim().replace(/\/+$/, "");
  if (isLocal) {
    if (!envUrl || envUrl.includes("vercel.app") || envUrl.includes("onrender.com")) {
      return "http://localhost:5173";
    }
    return envUrl;
  }
  return envUrl || defaultFrontendUrl;
})();

export const DASHBOARD_URL = (() => {
  const envUrl = (import.meta.env.VITE_DASHBOARD_URL || "").trim().replace(/\/+$/, "");
  if (isLocal) {
    if (!envUrl || envUrl.includes("vercel.app") || envUrl.includes("onrender.com")) {
      return "http://localhost:5174";
    }
    return envUrl;
  }
  return envUrl || defaultDashboardUrl;
})();
