import { apiRequest } from "./api";

export const getCurrentUser = () => apiRequest("/user/me");

export const updateUserProfile = (profileData) =>
  apiRequest("/user/profile", {
    method: "PUT",
    body: profileData,
  });
