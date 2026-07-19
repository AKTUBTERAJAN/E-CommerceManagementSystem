import API from "./api";

export const sendSupportMessage = (supportData) =>
  API.post("/support/send", supportData);
