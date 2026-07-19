import { apiRequest } from "./api";

export const sendSupportMessage = (supportData) =>
  apiRequest("/support/send", {
    method: "POST",
    body: JSON.stringify(supportData),
  });
