import { apiRequest } from "./api";

// Get Watchlist
export const getWatchlist = () =>
  apiRequest("/watchlist");

// Add Product
export const addToWatchlistAPI = (productId) =>
  apiRequest("/watchlist/add", {
    method: "POST",
    body: JSON.stringify({
      productId,
    }),
  });

// Remove Product
export const removeWatchlistAPI = (id) =>
  apiRequest(`/watchlist/${id}`, {
    method: "DELETE",
  });