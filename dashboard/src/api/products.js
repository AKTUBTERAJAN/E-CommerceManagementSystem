import { apiRequest } from "./api";

export const getProducts = (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  return apiRequest(`/product/list${searchParams ? `?${searchParams}` : ""}`);
};

export const getSubcategories = () => apiRequest("/product/subcategories");
