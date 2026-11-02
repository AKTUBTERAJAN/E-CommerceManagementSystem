const express = require("express");
const router = express.Router();
const { isConfigured } = require("../services/aiService");
const { chatWithAi, searchWithAi } = require("../controllers/aiController");

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
 * @desc    Chat with the BigMall AI shopping assistant
 * @access  Public
 */
router.post("/chat", chatWithAi);

/**
 * @route   GET /api/ai/search?q=...
 * @desc    AI Smart Search API combining direct MongoDB search and Gemini semantic parsing
 * @access  Public
 */
router.get("/search", searchWithAi);

module.exports = router;
