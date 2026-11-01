import axios from "axios";
import { API_URL, FILE_URL } from "../config";

const API = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

export const getFileUrl = (path) => {
  if (!path) return "media/user.png";
  if (path.startsWith("http")) return path;
  return `${FILE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

// Automatically send Bearer token if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token && token !== "null" && token !== "undefined") {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor for clear error reporting
API.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
