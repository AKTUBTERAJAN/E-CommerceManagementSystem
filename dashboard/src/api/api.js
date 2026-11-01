import { API_URL, FILE_URL } from "../config";

const getToken = () => localStorage.getItem("token");

export const getFileUrl = (path) => {
  if (!path) return "media/user.png";
  if (path.startsWith("http")) return path;
  return `${FILE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const apiRequest = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  if (token && token !== "null" && token !== "undefined") {
    headers.Authorization = `Bearer ${token}`;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const response = await fetch(`${API_URL}${cleanPath}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
};
