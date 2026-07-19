import { apiRequest } from "./api";

export const getCategories = () => apiRequest("/category/list");
