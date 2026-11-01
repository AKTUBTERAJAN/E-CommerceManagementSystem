const OpenAI = require("openai");

let openaiClient = null;

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_openai_api_key") {
    throw new Error(
      "OPENAI_API_KEY is missing or invalid. Please configure OPENAI_API_KEY in backend/.env"
    );
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: apiKey.trim(),
    });
  }

  return openaiClient;
};

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

module.exports = {
  getOpenAIClient,
  DEFAULT_MODEL,
};
