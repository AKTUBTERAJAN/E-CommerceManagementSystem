import { apiRequest } from "./api";

/**
 * Send customer message to the BigMall AI Chat & Customer Support API
 * Reuses the existing apiRequest utility which automatically attaches the customer's Bearer token
 * @param {string} message - Customer inquiry text
 * @returns {Promise<{ success: boolean, reply: string, products: Array, supportType?: string, orderData?: Object }>}
 */
export const sendChatMessage = (message) => {
  return apiRequest("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message: (message || "").trim() }),
  });
};

/**
 * Perform AI Smart Search for products across BigMall catalog
 * Properly encodes search query parameter 'q'
 * @param {string} query - Customer search text
 * @returns {Promise<{ success: boolean, query: string, count: number, products: Array, aiSummary?: string }>}
 */
export const searchAiProducts = (query) => {
  const encodedQuery = encodeURIComponent((query || "").trim());
  return apiRequest(`/ai/search?q=${encodedQuery}`);
};

/**
 * Fetch AI product recommendations based on real MongoDB products
 * Supports query parameters: { sid, productId, type, limit }
 * @param {Object} [params] - Optional recommendation parameters (e.g. { type: "foryou", limit: 6 })
 * @returns {Promise<{ success: boolean, type: string, count: number, recommendations: Array, aiSummary?: string }>}
 */
export const getAiRecommendations = (params = {}) => {
  const cleanParams = {};
  if (params.type) cleanParams.type = params.type;
  if (params.limit !== undefined) cleanParams.limit = params.limit;
  if (params.sid !== undefined) cleanParams.sid = params.sid;
  if (params.productId) cleanParams.productId = params.productId;

  const queryString = new URLSearchParams(cleanParams).toString();
  return apiRequest(`/ai/recommendations${queryString ? `?${queryString}` : ""}`);
};

/**
 * Check AI service configuration and health status
 * Connects to GET /api/ai/health
 * @returns {Promise<{ success: boolean, service: string, configured: boolean }>}
 */
export const checkAiHealth = () => {
  return apiRequest("/ai/health");
};
