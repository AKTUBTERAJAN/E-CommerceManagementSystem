// Detect if running on localhost / local development
const isLocal =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
   window.location.hostname === "127.0.0.1");

const defaultApiUrl = isLocal
  ? "http://localhost:5000/api"
  : "https://bigmall-backend.onrender.com/api";

const API_URL = (() => {
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

const FILE_URL = API_URL.replace(/\/api$/, "");

const getToken = () => localStorage.getItem("token");

export const getFileUrl = (path) => {
  if (!path) return "media/user.png";
  if (path.startsWith("http")) return path;
  return `${FILE_URL}${path}`;
};

export const apiRequest = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
