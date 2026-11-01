import API from "./api";

export const getProducts = (params = {}) => API.get("/product/list", { params });

export const searchProducts = (query, params = {}) =>
  API.get("/product/search", { params: { q: query, ...params } });

export const getRecommendations = (params = {}) =>
  API.get("/product/recommendations", { params });

export const getSubcategories = () => API.get("/product/subcategories");
