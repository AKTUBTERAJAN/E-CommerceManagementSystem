import { apiRequest } from "./api";

// Wallet Details
export const getWallet = () =>
  apiRequest("/wallet");

// Add Money
export const addMoneyAPI = (amount) =>
  apiRequest("/wallet/add", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });

// Deduct Money
export const deductMoneyAPI = (amount) =>
  apiRequest("/wallet/deduct", {
    method: "POST",
    body: JSON.stringify({ amount }),
  });