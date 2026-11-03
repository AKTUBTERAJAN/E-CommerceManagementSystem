import API from "./api";

/**
 * Send customer query to the BigMall AI Chat & Customer Support API
 * Automatically includes logged-in user's Bearer token via API interceptor if available
 * @param {string} message - User query text
 * @returns {Promise<{ success: boolean, reply: string, products: Array, supportType?: string, orderData?: Object }>}
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

/**
 * Perform AI Smart Search for products
 * @param {string} query - Customer search query text
 * @returns {Promise<{ success: boolean, query: string, count: number, products: Array, aiSummary?: string }>}
 */
export const searchAiProducts = async (query) => {
  const response = await API.get("/ai/search", { params: { q: query } });
  return response.data;
};

/**
 * Fetch AI product recommendations based on real MongoDB products
 * @param {Object} [params] - Optional query parameters: { sid, productId, type, limit }
 * @returns {Promise<{ success: boolean, type: string, count: number, recommendations: Array, aiSummary?: string }>}
 */
export const getAiRecommendations = async (params = {}) => {
  const response = await API.get("/ai/recommendations", { params });
  return response.data;
};
