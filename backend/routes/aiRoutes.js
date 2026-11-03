const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { isConfigured } = require("../services/aiService");
const { chatWithAi, searchWithAi, getRecommendations } = require("../controllers/aiController");

/**
 * Optional authentication middleware for AI requests
 * Attaches req.user if a valid Bearer token is provided.
 * If no token or invalid/expired token is provided, req.user remains null (guest mode).
 */
const optionalAuth = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Contains decoded.id
    } catch (err) {
      // Invalid or expired token: fall back safely to guest mode
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};

/**
 * @route   GET /api/ai/health
 * @desc    Check AI service configuration status without calling OpenAI or consuming credits
 * @access  Public
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "BigMall AI Service",
    configured: isConfigured(),
  });
});

/**
 * @route   POST /api/ai/chat
 * @desc    Chat with BigMall AI shopping & customer support assistant
 * @access  Public (Optional JWT authentication enables personalized order tracking)
 */
router.post("/chat", optionalAuth, chatWithAi);

/**
 * @route   GET /api/ai/search?q=...
 * @desc    AI Smart Search API combining direct MongoDB search and Gemini semantic parsing
 * @access  Public
 */
router.get("/search", searchWithAi);

/**
 * @route   GET /api/ai/recommendations
 * @desc    AI Product Recommendations API based on real MongoDB products
 * @access  Public
 */
router.get("/recommendations", getRecommendations);

module.exports = router;
