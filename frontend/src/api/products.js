import API from "./api";

export const getProducts = (params = {}) => API.get("/product/list", { params });

export const getSubcategories = () => API.get("/product/subcategories");
