const express = require("express");
const {
  handleChat,
  getMySupportOrders,
  cancelOrderSupport,
  getSupportFAQ,
} = require("../controllers/aiController");
const { getRecommendations } = require("../controllers/productController");
const aiRateLimiter = require("../middleware/aiRateLimiter");
const { validateChatRequest } = require("../middleware/aiValidation");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   GET /api/ai/status
 * @desc    Check AI service availability status
 * @access  Public
 */
router.get("/status", (req, res) => {
  const isConfigured = Boolean(
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_API_KEY.trim() !== "" &&
    process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
  );

  res.status(200).json({
    success: true,
    status: isConfigured ? "configured" : "ready",
    service: "Bigmall AI Customer Support & Recommendations",
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  });
});

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with Bigmall AI Customer Support Assistant
 * @access  Public (supports verified Authorization Bearer token for personal orders)
 */
router.post("/chat", aiRateLimiter, validateChatRequest, handleChat);

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get AI personalized product recommendations
 * @access  Public (optional Bearer token)
 */
router.get("/recommendations", getRecommendations);

/**
 * @route   GET /api/ai/support/orders
 * @desc    Get authenticated user's own orders with tracking status for AI Support
 * @access  Private (Bearer token required)
 */
router.get("/support/orders", protect, getMySupportOrders);

/**
 * @route   POST /api/ai/support/cancel-order
 * @desc    Authorized order cancellation with instant wallet refund via AI Support
 * @access  Private (Bearer token required)
 */
router.post("/support/cancel-order", protect, cancelOrderSupport);

/**
 * @route   GET /api/ai/support/faq
 * @desc    Get Bigmall services FAQ list
 * @access  Public
 */
router.get("/support/faq", getSupportFAQ);

module.exports = router;
