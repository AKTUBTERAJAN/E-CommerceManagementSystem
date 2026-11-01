const aiCustomerSupportService = require("../services/aiCustomerSupportService");

/**
 * Handle POST /api/ai/chat
 * Integrates Bigmall Customer Support, order verification, tracking, and cancellation
 */
const handleChat = async (req, res) => {
  try {
    const { message, messages, language } = req.body;

    // 1. Resolve authentication safely from Authorization header
    const authHeader = req.headers.authorization || "";
    let userContext = await aiCustomerSupportService.resolveUser(authHeader);

    // If already populated by upstream middleware
    if (req.user && req.user.id && !userContext.isAuthenticated) {
      userContext = await aiCustomerSupportService.resolveUser(`Bearer ${authHeader.replace(/^Bearer\s+/i, "")}`);
    }

    // 2. Process query with verified user authorization
    const result = await aiCustomerSupportService.processSupportQuery({
      userMessage: message,
      messages: messages || [],
      userContext,
      language: language || "en",
    });

    return res.status(200).json({
      success: true,
      reply: result.reply,
      orders: result.orders || [],
      selectedOrder: result.selectedOrder || null,
      actionResult: result.actionResult || null,
      user: result.user || { isAuthenticated: false },
      intent: result.intent,
      requiresLogin: Boolean(result.requiresLogin),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in aiController.handleChat:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An unexpected error occurred in AI Customer Support.",
    });
  }
};

/**
 * Handle GET /api/ai/support/orders
 * Returns caller's own orders with tracking status
 */
const getMySupportOrders = async (req, res) => {
  try {
    const orders = await aiCustomerSupportService.getUserOrders(req.user.id, 20);
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Error in getMySupportOrders:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve orders",
    });
  }
};

/**
 * Handle POST /api/ai/support/cancel-order
 * Verified cancellation and wallet refund for caller's own order
 */
const cancelOrderSupport = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId || typeof orderId !== "string") {
      return res.status(400).json({
        success: false,
        message: "A valid 'orderId' is required.",
      });
    }

    const result = await aiCustomerSupportService.cancelAndRefundOrder({
      orderId,
      userId: req.user.id,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error in cancelOrderSupport:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to process order cancellation",
    });
  }
};

/**
 * Handle GET /api/ai/support/faq
 * Structured FAQ for customer support page and chatbot
 */
const getSupportFAQ = (req, res) => {
  const language = req.query.lang || "en";
  const faqs = aiCustomerSupportService.getFAQList(language);
  return res.status(200).json({
    success: true,
    faqs,
  });
};

module.exports = {
  handleChat,
  getMySupportOrders,
  cancelOrderSupport,
  getSupportFAQ,
};
