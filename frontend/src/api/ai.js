import API from "./api";

/**
 * Send customer query to the BigMall AI Chat API
 * @param {string} message - User query text
 * @returns {Promise<{ success: boolean, reply: string, products: Array }>}
 */
export const sendChatMessage = async (message) => {
  const response = await API.post("/ai/chat", { message });
  return response.data;
};

/**
 * Check AI service health status
 * @returns {Promise<{ success: boolean, service: string, configured: boolean }>}
 */
export const checkAiHealth = async () => {
  const response = await API.get("/ai/health");
  return response.data;
};
