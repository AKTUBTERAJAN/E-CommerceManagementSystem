import { apiRequest } from "./api";

// Get Logged In User Cart
export const getCart = () =>
  apiRequest("/cart");

// Add Product To Cart
export const addToCart = (productId, quantity) =>
  apiRequest("/cart/add", {
    method: "POST",
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

// Remove One Product
export const removeCartItem = (cartId) =>
  apiRequest(`/cart/${cartId}`, {
    method: "DELETE",
  });

// Clear Full Cart
export const clearCart = () =>
  apiRequest("/cart/clear/all", {
    method: "DELETE",
  });