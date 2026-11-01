const { getOpenAIClient, DEFAULT_MODEL } = require("../config/openai");

const DEFAULT_SYSTEM_PROMPT = `You are "Bigmall AI Assistant", a smart, friendly, and helpful e-commerce shopping assistant for Bigmall.
Your role:
- Help shoppers discover products, navigate categories, find fresh deals, and get answers about shopping on Bigmall.
- Assist with general product inquiries, cart recommendations, and shopping advice.
- Fluently support both English and Hindi (हिन्दी / Hinglish). Respond naturally in the language preferred by the customer.
- Be polite, concise, informative, and engaging. Keep responses reasonably brief and easy to read on desktop or mobile.
- If asked about specific store orders or sensitive account details when none are provided, politely advise the user to check their Orders or Profile page in Bigmall.
- Always remain truthful to Bigmall's features (fresh items, deals, wallet payment, order tracking) and do not invent fake promotional codes or non-existent policies.`;

class AIService {
  /**
   * Generates a chat completion response from OpenAI.
   *
   * @param {Object} options
   * @param {string} [options.userMessage] - The latest user message string.
   * @param {Array<{role: string, content: string}>} [options.messages] - Previous conversation history.
   * @param {string} [options.systemPrompt] - Custom system instruction if needed.
   * @param {Object} [options.userContext] - Additional authenticated user context (e.g. name, email).
   * @param {string} [options.language] - Preferred language ('en' | 'hi' | 'auto').
   * @param {string} [options.model] - Specific model to use, defaults to env/DEFAULT_MODEL.
   * @param {number} [options.temperature] - Sampling temperature (default 0.7).
   * @param {number} [options.maxTokens] - Max tokens to generate (default 600).
   * @returns {Promise<{reply: string, usage: Object, model: string}>}
   */
  async generateChatResponse({
    userMessage,
    messages = [],
    systemPrompt = DEFAULT_SYSTEM_PROMPT,
    userContext = null,
    language = "en",
    model = DEFAULT_MODEL,
    temperature = 0.7,
    maxTokens = 600,
  }) {
    const client = getOpenAIClient();

    // Prepare system instructions with user context if present
    let effectiveSystemPrompt = systemPrompt;
    if (userContext && userContext.name) {
      effectiveSystemPrompt += `\nCustomer Context: The current user is logged in as "${userContext.name}".`;
    }

    if (language === "hi") {
      effectiveSystemPrompt += `\nLanguage Instruction: The user has selected Hindi. Respond in polite, friendly Hindi (Devanagari script or natural Hinglish where common in Indian e-commerce) to help them shop smoothly.`;
    } else if (language === "en") {
      effectiveSystemPrompt += `\nLanguage Instruction: Respond in friendly and clear English.`;
    }

    // Assemble message payload for OpenAI chat completions
    const formattedMessages = [{ role: "system", content: effectiveSystemPrompt }];

    // Append prior conversation history if provided
    if (Array.isArray(messages) && messages.length > 0) {
      for (const msg of messages) {
        if (msg.role && msg.content) {
          formattedMessages.push({
            role: msg.role,
            content: String(msg.content),
          });
        }
      }
    }

    // Append the latest user message if not already present in the history
    if (userMessage) {
      const lastMsg = formattedMessages[formattedMessages.length - 1];
      if (!lastMsg || lastMsg.role !== "user" || lastMsg.content !== userMessage) {
        formattedMessages.push({
          role: "user",
          content: userMessage,
        });
      }
    }

    try {
      const response = await client.chat.completions.create({
        model: model || DEFAULT_MODEL,
        messages: formattedMessages,
        temperature,
        max_tokens: maxTokens,
      });

      const choice = response.choices && response.choices[0];
      const reply = choice?.message?.content || "";

      return {
        reply,
        usage: response.usage || null,
        model: response.model || model,
      };
    } catch (error) {
      console.error("OpenAI API Error in aiService:", error.message);
      throw error;
    }
  }

  /**
   * Parse a natural language shopping query into structured search criteria.
   * Gracefully returns null on any error or missing API key so caller can fallback.
   *
   * @param {string} query
   * @returns {Promise<{
   *   keywords?: string,
   *   minPrice?: number|null,
   *   maxPrice?: number|null,
   *   isDeal?: boolean|null,
   *   isFresh?: boolean|null,
   *   isLatest?: boolean|null,
   *   sortBy?: string|null,
   *   subcategoryHint?: string|null
   * }|null>}
   */
  async parseSearchQuery(query) {
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return null;
    }

    try {
      const client = getOpenAIClient();

      const systemPrompt = `You are an e-commerce search query parser for Bigmall.
Extract structured search criteria from the user's natural language shopping query.
Return a single JSON object with these exact keys:
- "keywords": string (core product keywords or items to search, e.g. "shoes", "smartphone", "laptop", "masala")
- "minPrice": number or null (e.g. 500 for "above 500")
- "maxPrice": number or null (e.g. 2000 for "under 2000" or "below 2000", or reasonable budget limit if "affordable")
- "isDeal": boolean or null (true if mentions deals, discount, offers, cheap, sale)
- "isFresh": boolean or null (true if mentions fresh, vegetables, fruits, groceries)
- "isLatest": boolean or null (true if mentions new, latest, newest, recently added)
- "sortBy": string or null ("price_asc", "price_desc", "discount_desc", "latest", "relevance")
- "subcategoryHint": string or null (potential category name)
Output strictly valid JSON.`;

      const response = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: query.trim() },
        ],
        temperature: 0.1,
        max_tokens: 200,
        response_format: { type: "json_object" },
      });

      const content = response.choices?.[0]?.message?.content;
      if (!content) return null;

      const parsed = JSON.parse(content);
      return {
        keywords: typeof parsed.keywords === "string" ? parsed.keywords.trim() : "",
        minPrice: typeof parsed.minPrice === "number" ? parsed.minPrice : null,
        maxPrice: typeof parsed.maxPrice === "number" ? parsed.maxPrice : null,
        isDeal: typeof parsed.isDeal === "boolean" ? parsed.isDeal : null,
        isFresh: typeof parsed.isFresh === "boolean" ? parsed.isFresh : null,
        isLatest: typeof parsed.isLatest === "boolean" ? parsed.isLatest : null,
        sortBy: typeof parsed.sortBy === "string" ? parsed.sortBy : null,
        subcategoryHint: typeof parsed.subcategoryHint === "string" ? parsed.subcategoryHint : null,
      };
    } catch (err) {
      console.warn("AI parseSearchQuery fallback triggered:", err.message);
      return null;
    }
  }

  /**
   * Rank and select personalized product recommendations from actual database products.
   *
   * @param {Object} options
   * @param {Array<Object>} options.userHistory - List of past purchases or cart items.
   * @param {Array<Object>} options.availableProducts - Real products from MongoDB.
   * @param {number} [options.limit=6] - Max products to return.
   * @returns {Promise<{recommendedIds: string[], reason: string}|null>}
   */
  async rankRecommendations({ userHistory = [], availableProducts = [], limit = 6 }) {
    if (!availableProducts || availableProducts.length === 0) {
      return null;
    }

    try {
      const client = getOpenAIClient();

      const productsSnapshot = availableProducts.map((p) => ({
        id: String(p._id),
        name: p.subcategory_name,
        price: p.discount_price || p.price,
        sid: p.sid,
        isDeal: p.isDeal,
        isFresh: p.isFresh,
      }));

      const systemPrompt = `You are Bigmall's Recommendation AI.
Analyze customer purchase/interest history and select up to ${limit} best matching products from the available products list.
Strict Rules:
- NEVER invent new products, fake prices, or fake IDs. ONLY pick from the given "Available Products".
- Prioritize relevant categories, fresh essentials, and high-value deals.
- Return strictly valid JSON matching:
  {
    "recommendedIds": ["id1", "id2", ...],
    "reason": "Short friendly sentence explaining why these were picked (e.g. Based on your recent orders in Fresh Groceries)"
  }`;

      const userPrompt = `User History: ${JSON.stringify(userHistory.slice(0, 10))}
Available Products: ${JSON.stringify(productsSnapshot.slice(0, 30))}`;

      const response = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 250,
        response_format: { type: "json_object" },
      });

      const content = response.choices?.[0]?.message?.content;
      if (!content) return null;

      const parsed = JSON.parse(content);
      return {
        recommendedIds: Array.isArray(parsed.recommendedIds) ? parsed.recommendedIds : [],
        reason: typeof parsed.reason === "string" ? parsed.reason : "Personalized recommendations for you",
      };
    } catch (err) {
      console.warn("AI rankRecommendations fallback triggered:", err.message);
      return null;
    }
  }

  /**
   * General completion utility for downstream AI features (e.g., search expansion, categorization, summary).
   *
   * @param {Object} options
   * @param {string} options.prompt - Prompt string.
   * @param {string} [options.systemPrompt] - System instructions.
   * @param {string} [options.model] - Model name.
   * @returns {Promise<string>}
   */
  async generateCompletion({
    prompt,
    systemPrompt = "You are an intelligent e-commerce assistant for Bigmall.",
    model = DEFAULT_MODEL,
    temperature = 0.5,
    maxTokens = 300,
  }) {
    const response = await this.generateChatResponse({
      userMessage: prompt,
      systemPrompt,
      model,
      temperature,
      maxTokens,
    });
    return response.reply;
  }
}

module.exports = new AIService();
