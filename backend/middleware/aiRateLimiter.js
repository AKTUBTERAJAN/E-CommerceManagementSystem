const { rateLimit } = require("express-rate-limit");

/**
 * Rate limiter middleware for AI endpoints to prevent abuse and manage API costs.
 * Defaults to 60 requests per 15-minute window per IP.
 */
const aiRateLimiter = rateLimit({
  windowMs: parseInt(process.env.AI_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AI_RATE_LIMIT_MAX, 10) || 60, // Limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many AI requests from this IP. Please wait a few minutes before trying again.",
      retryAfter: Math.ceil((req.rateLimit.resetTime - Date.now()) / 1000),
    });
  },
});

module.exports = aiRateLimiter;
