const OpenAI = require("openai");

const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";
const GEMINI_MODEL = "gemini-3.5-flash-lite";

/**
 * Safely check whether the Gemini API key is configured.
 * @returns {boolean} True if GEMINI_API_KEY is present and non-empty.
 */
const isConfigured = () => {
  return Boolean(
    process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== ""
  );
};

/**
 * Lazily instantiate and return the OpenAI client configured for Google Gemini.
 * Does not make any network requests or throw if the key is missing.
 * @returns {OpenAI | null} The OpenAI client instance configured for Gemini, or null if unconfigured.
 */
const getClient = () => {
  if (!isConfigured()) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.GEMINI_API_KEY.trim(),
    baseURL: GEMINI_BASE_URL,
  });
};

module.exports = {
  isConfigured,
  getClient,
  GEMINI_MODEL,
  GEMINI_BASE_URL,
};
