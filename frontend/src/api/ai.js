import API from "./api";

/**
 * Send a chat message or prompt to the Bigmall AI Assistant.
 * Uses the backend /api/ai/chat endpoint to keep OpenAI credentials completely secure.
 * Automatically attaches Authorization header via axios interceptor if logged in.
 *
 * @param {Object} payload
 * @param {string} payload.message - The user's input prompt or message.
 * @param {Array<{role: string, content: string}>} [payload.messages] - Optional conversation history.
 * @param {string} [payload.language] - Optional language preference ('en' | 'hi').
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const sendAIChatMessage = ({ message, messages = [], language = "en" }) => {
  return API.post("/ai/chat", { message, messages, language });
};

/**
 * Check if the AI backend service is configured and ready.
 *
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getAIStatus = () => {
  return API.get("/ai/status");
};

/**
 * Get AI-powered product recommendations based on user history or trending essentials.
 *
 * @param {Object} [params]
 * @param {number} [params.limit=6]
 * @param {string} [params.productId]
 * @param {number} [params.sid]
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getAIRecommendations = (params = {}) => {
  return API.get("/ai/recommendations", { params });
};

/**
 * Fetch authenticated user's own orders for AI Customer Support.
 *
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getAISupportOrders = () => {
  return API.get("/ai/support/orders");
};

/**
 * Perform authorized order cancellation and instant wallet refund via AI Support.
 *
 * @param {string} orderId
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const cancelOrderViaAI = (orderId) => {
  return API.post("/ai/support/cancel-order", { orderId });
};

/**
 * Get structured FAQs about Bigmall services (orders, tracking, delivery, cancellations, refunds, returns).
 *
 * @param {string} [lang="en"]
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getAISupportFAQ = (lang = "en") => {
  return API.get("/ai/support/faq", { params: { lang } });
};
