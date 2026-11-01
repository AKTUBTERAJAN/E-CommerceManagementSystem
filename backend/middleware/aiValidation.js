/**
 * Request validation middleware for AI chat endpoints.
 */
const validateChatRequest = (req, res, next) => {
  const { message, messages } = req.body;

  // Must provide either a direct `message` string or a `messages` array
  if (!message && (!Array.isArray(messages) || messages.length === 0)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a 'message' string or a non-empty 'messages' array.",
    });
  }

  // If single message provided, validate string and length
  if (message !== undefined) {
    if (typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "'message' must be a non-empty text string.",
      });
    }

    if (message.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message is too long. Maximum allowed length is 2000 characters.",
      });
    }

    req.body.message = message.trim();
  }

  // If conversation history (messages array) provided, validate structure
  if (messages !== undefined) {
    if (!Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        message: "'messages' must be an array of message objects.",
      });
    }

    if (messages.length > 30) {
      return res.status(400).json({
        success: false,
        message: "Too many conversation messages. Maximum history length is 30 messages.",
      });
    }

    const validRoles = new Set(["user", "assistant", "system"]);
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (!msg || typeof msg !== "object") {
        return res.status(400).json({
          success: false,
          message: `Message at index ${i} must be an object with 'role' and 'content'.`,
        });
      }

      if (!validRoles.has(msg.role)) {
        return res.status(400).json({
          success: false,
          message: `Invalid role '${msg.role}' at index ${i}. Allowed roles: user, assistant, system.`,
        });
      }

      if (typeof msg.content !== "string" || msg.content.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: `Message content at index ${i} must be a non-empty string.`,
        });
      }

      if (msg.content.length > 4000) {
        return res.status(400).json({
          success: false,
          message: `Message content at index ${i} exceeds maximum limit of 4000 characters.`,
        });
      }
    }
  }

  next();
};

module.exports = {
  validateChatRequest,
};
