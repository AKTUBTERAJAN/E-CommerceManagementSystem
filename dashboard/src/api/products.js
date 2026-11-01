import { apiRequest } from "./api";

export const getProducts = (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  return apiRequest(`/product/list${searchParams ? `?${searchParams}` : ""}`);
};

export const searchProducts = (query, params = {}) => {
  const searchParams = new URLSearchParams({ q: query, ...params }).toString();
  return apiRequest(`/product/search${searchParams ? `?${searchParams}` : ""}`);
};

export const getRecommendations = (params = {}) => {
  const searchParams = new URLSearchParams(params).toString();
  return apiRequest(`/product/recommendations${searchParams ? `?${searchParams}` : ""}`);
};

export const getSubcategories = () => apiRequest("/product/subcategories");
