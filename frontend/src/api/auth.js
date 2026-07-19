import API from "./api";

export const loginUser = (email, password) =>
  API.post("/user/login", { email, password });

export const registerUser = (userData) =>
  API.post("/user/register", userData);

// Admin Login
export const loginAdmin = (email, password) =>
  API.post("/admin/login", { email, password });

// Admin Register
export const registerAdmin = (name, email, password) =>
  API.post("/admin/register", { name, email, password });
