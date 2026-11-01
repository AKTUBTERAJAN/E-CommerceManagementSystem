import { apiRequest } from "./api";

/**
 * Send a message to the Bigmall AI Assistant endpoint.
 * Automatically attaches the user's JWT authorization token via apiRequest.
 *
 * @param {Object} payload
 * @param {string} payload.message
 * @param {Array<{role: string, content: string}>} [payload.messages]
 * @param {string} [payload.language]
 * @returns {Promise<any>}
 */
export const sendAIChatMessage = ({ message, messages = [], language = "en" }) => {
  return apiRequest("/ai/chat", {
    method: "POST",
    body: JSON.stringify({ message, messages, language }),
  });
};

/**
 * Check AI status
 */
export const getAIStatus = () => {
  return apiRequest("/ai/status");
};

/**
 * Get AI-powered personalized product recommendations
 *
 * @param {Object} [params]
 * @returns {Promise<any>}
 */
export const getAIRecommendations = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiRequest(`/ai/recommendations${query ? `?${query}` : ""}`);
};

/**
 * Fetch authenticated user's own orders for AI Customer Support.
 *
 * @returns {Promise<any>}
 */
export const getAISupportOrders = () => {
  return apiRequest("/ai/support/orders");
};

/**
 * Perform authorized order cancellation and instant wallet refund via AI Support.
 *
 * @param {string} orderId
 * @returns {Promise<any>}
 */
export const cancelOrderViaAI = (orderId) => {
  return apiRequest("/ai/support/cancel-order", {
    method: "POST",
    body: JSON.stringify({ orderId }),
  });
};

/**
 * Get structured FAQs about Bigmall services.
 *
 * @param {string} [lang="en"]
 * @returns {Promise<any>}
 */
export const getAISupportFAQ = (lang = "en") => {
  return apiRequest(`/ai/support/faq?lang=${encodeURIComponent(lang)}`);
};
