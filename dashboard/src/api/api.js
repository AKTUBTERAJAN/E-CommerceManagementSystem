const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
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
