import { apiRequest } from "./api";

export const createOrder = (orderData) =>
  apiRequest("/order/create", {
    method: "POST",
    body: JSON.stringify(orderData),
  });

export const getMyOrders = () => apiRequest("/order/my");
export const getCancelledOrders = () => apiRequest("/order/cancelled");

export const updateOrderStatusApi = (orderId, statusData) =>
  apiRequest(`/order/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify(statusData),
  });

export const deleteOrderApi = (orderId) =>
  apiRequest(`/order/${orderId}`, {
    method: "DELETE",
  });
