import API from "./api";

// Add Category
export const addCategory = (name) =>
  API.post("/category/add", { name });

// List Categories
export const getCategories = () =>
  API.get("/category/list");
