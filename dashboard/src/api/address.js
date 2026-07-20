import { apiRequest } from "./api";

// Add New Address
export const addAddress = (data) =>
  apiRequest("/address/add", {
    method: "POST",
    body: JSON.stringify(data),
  });

// Get All Addresses
export const getAddresses = () =>
  apiRequest("/address");

// Update Address
export const updateAddress = (id, data) =>
  apiRequest(`/address/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// Delete Address
export const deleteAddress = (id) =>
  apiRequest(`/address/delete/${id}`, {
    method: "DELETE",
  });