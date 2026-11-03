const mongoose = require("mongoose");
const Product = require("../models/Products");
const { getClient, isConfigured, GEMINI_MODEL } = require("../services/aiService");
const { searchProducts } = require("../services/productSearchService");
const { getProductRecommendations } = require("../services/productRecommendationService");
const { handleCustomerSupportInquiry } = require("../services/customerSupportService");

/**
 * Format retrieved products into a compact text summary for Gemini system prompt
 * @param {Array} products
 * @returns {string}
 */
function formatProductsForPrompt(products) {
  if (!products || products.length === 0) {
    return "No matching products found in Bigmall inventory.";
  }

  return products
    .map((p, index) => {
      const parts = [`${index + 1}. Name: ${p.subcategory_name}`];
      if (p.discount_price !== undefined) {
        parts.push(`Price: ₹${p.discount_price}`);
      }
      if (p.price !== undefined && p.price !== p.discount_price) {
        parts.push(`MRP: ₹${p.price}`);
      }
      if (p.total_discount) {
        parts.push(`Discount: ${p.total_discount}% off`);
      }
      if (p.product_quantity) {
        parts.push(`Quantity: ${p.product_quantity}`);
      }
      return parts.join(" | ");
    })
    .join("\n");
}

/**
 * Helper to project customer-facing product fields
 * @param {Object} p - Mongoose product document or lean object
 * @returns {Object}
 */
function formatProductResponse(p) {
  return {
    _id: p._id,
    subcategory_name: p.subcategory_name,
    price: p.price,
    discount_price: p.discount_price,
    total_discount: p.total_discount || 0,
    product_quantity: p.product_quantity,
    product_pic: p.product_pic || "",
    sid: p.sid,
  };
}

/**
 * @route   POST /api/ai/chat
 * @desc    Answer customer shopping and support questions using MongoDB, policies, and Google Gemini
 * @access  Public (Optional JWT authentication for personalized order support)
 */
const chatWithAi = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Validate that message exists
    if (message === undefined || message === null) {
      return res.status(400).json({
        success: false,
        error: "Message is required.",
      });
    }

    // 2. Reject empty messages
    if (typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Message cannot be empty.",
      });
    }

    const trimmedMessage = message.trim();

    // 3. Limit message length
    if (trimmedMessage.length > 500) {
      return res.status(400).json({
        success: false,
        error: "Message exceeds maximum allowed length of 500 characters.",
      });
    }

    // 4. Handle Customer Support & Order Inquiries deterministically
    // Authenticated user ID is obtained exclusively from verified JWT (req.user.id)
    const userId = req.user?.id || null;
    const supportResult = await handleCustomerSupportInquiry({
      message: trimmedMessage,
      userId,
    });

    if (supportResult) {
      return res.status(200).json({
        success: true,
        reply: supportResult.reply,
        products: [],
        supportType: supportResult.type,
        orderData: supportResult.orderData || null,
      });
    }

    // 5. If not a customer support inquiry, verify AI service is configured for product shopping
    if (!isConfigured()) {
      return res.status(503).json({
        success: false,
        error: "AI service is currently unconfigured. Please configure GEMINI_API_KEY.",
      });
    }

    // 6. Search MongoDB for relevant products
    let products = [];
    try {
      products = await searchProducts(trimmedMessage, 10);
    } catch (dbError) {
      return res.status(500).json({
        success: false,
        error: "Failed to search product catalog. Please try again later.",
      });
    }

    // 7. Build prompt following AI RESPONSE RULES
    const productDataString = formatProductsForPrompt(products);
    const systemPrompt = `You are the official Bigmall AI Shopping Assistant, a polite, helpful, and professional assistant for Bigmall e-commerce store.

RULES:
1. Answer customer product questions using ONLY the supplied MongoDB product records below.
2. NEVER invent, assume, or hallucinate product names, prices, discounts, quantities, or availability not present in the supplied records.
3. If no matching product is found in the supplied records, clearly and politely inform the customer that no matching product was found in Bigmall's inventory, and offer to help them find something else.
4. When recommending or listing products, include their name, selling / discount price (in ₹ rupees), original MRP price (if different), and package quantity.
5. If the customer asks for items under a specific price, only recommend items whose price satisfies their criteria from the supplied records.
6. If the customer asks non-shopping or out-of-scope questions, politely guide them back to shopping at Bigmall.
7. Keep responses concise, well-formatted, and helpful. Use clean bullet points when listing multiple items.

SUPPLIED BIGMALL PRODUCT RECORDS:
${productDataString}`;

    // 8. Invoke Google Gemini via OpenAI-compatible SDK
    let reply = "";
    try {
      const client = getClient();
      const completion = await client.chat.completions.create({
        model: GEMINI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: trimmedMessage },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      reply = completion.choices?.[0]?.message?.content?.trim() || "";
    } catch (aiError) {
      if (aiError.status === 401 || (aiError.code && String(aiError.code).includes("api_key"))) {
        return res.status(502).json({
          success: false,
          error: "AI service authentication failed. Invalid API key provided.",
        });
      }

      if (aiError.status === 429) {
        return res.status(429).json({
          success: false,
          error: "AI service rate limit or quota exceeded. Please try again shortly.",
        });
      }

      return res.status(502).json({
        success: false,
        error: "AI service is currently unavailable. Please try again later.",
      });
    }

    // 9. Return response
    return res.status(200).json({
      success: true,
      reply,
      products: products.map(formatProductResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while processing your request.",
    });
  }
};

/**
 * @route   GET /api/ai/search?q=...
 * @desc    AI Smart Search API combining direct MongoDB search and Gemini semantic parsing
 * @access  Public
 */
const searchWithAi = async (req, res) => {
  try {
    const rawQuery = req.query.q || req.query.query || "";

    // 1. Validate query exists
    if (typeof rawQuery !== "string" || rawQuery.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Search query is required.",
      });
    }

    const query = rawQuery.trim();

    // 2. Validate maximum length (prevent DOS / prompt bloat)
    if (query.length > 300) {
      return res.status(400).json({
        success: false,
        error: "Search query exceeds maximum allowed length of 300 characters.",
      });
    }

    // 3. Step 1: Attempt Direct MongoDB Keyword & Price Search first
    let products = [];
    try {
      products = await searchProducts(query, 10);
    } catch (dbErr) {
      return res.status(500).json({
        success: false,
        error: "Failed to search product catalog. Please try again later.",
      });
    }

    // If direct search found matches, return immediately (fast response, 0 Gemini tokens/quota used)
    if (products.length > 0) {
      const count = products.length;
      const aiSummary =
        count === 1
          ? `Found 1 matching product for "${query}".`
          : `Found ${count} products matching "${query}".`;

      return res.status(200).json({
        success: true,
        query,
        count,
        products: products.map(formatProductResponse),
        aiSummary,
      });
    }

    // 4. Step 2: Semantic Intent Search with Gemini when direct match yielded 0 items
    if (isConfigured()) {
      try {
        const distinctCategories = await Product.distinct("subcategory_name");

        const client = getClient();
        const systemPrompt = `You are a search query parser for Bigmall grocery e-commerce.
Available Bigmall categories: ${distinctCategories.join(", ")}.

Task: Analyze the user's shopping search query.
Map it ONLY to relevant category names from the list above.
Extract any max price constraint (number or null).
Write a brief, friendly summary (1 sentence).

Output strictly valid JSON only:
{
  "relevantCategories": ["category1", "category2"],
  "maxPrice": null,
  "summary": "Brief summary here"
}`;

        const completion = await client.chat.completions.create({
          model: GEMINI_MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `User search query: "${query}"` },
          ],
          max_tokens: 200,
          temperature: 0.1,
        });

        const raw = completion.choices?.[0]?.message?.content?.trim() || "{}";
        const cleanJson = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i);
        const parsed = JSON.parse(cleanJson);

        let semanticProducts = [];
        const matchedCats = Array.isArray(parsed.relevantCategories)
          ? parsed.relevantCategories.filter((c) => distinctCategories.includes(c))
          : [];

        if (matchedCats.length > 0) {
          const filter = { subcategory_name: { $in: matchedCats } };
          if (parsed.maxPrice && typeof parsed.maxPrice === "number") {
            filter.discount_price = { $lte: parsed.maxPrice };
          }
          semanticProducts = await Product.find(filter)
            .select("_id subcategory_name price discount_price total_discount product_quantity product_pic sid")
            .limit(10)
            .lean();
        }

        const count = semanticProducts.length;
        const aiSummary =
          parsed.summary ||
          (count > 0
            ? `Found ${count} relevant products for "${query}".`
            : `No matching products found in Bigmall inventory for "${query}".`);

        return res.status(200).json({
          success: true,
          query,
          count,
          products: semanticProducts.map(formatProductResponse),
          aiSummary,
        });
      } catch (aiErr) {
        // Fallback gracefully on Gemini failure/quota limit
        return res.status(200).json({
          success: true,
          query,
          count: 0,
          products: [],
          aiSummary: `No matching products found in Bigmall inventory for "${query}".`,
        });
      }
    }

    // If AI service is not configured and direct search returned 0 items
    return res.status(200).json({
      success: true,
      query,
      count: 0,
      products: [],
      aiSummary: `No matching products found in Bigmall inventory for "${query}".`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while processing your search.",
    });
  }
};

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get AI product recommendations based on real MongoDB products
 * @access  Public
 */
const getRecommendations = async (req, res) => {
  try {
    const { sid, productId, type = "foryou", limit = 6 } = req.query;

    // 1. Validate 'type' parameter
    const validTypes = ["foryou", "complementary", "deals", "trending"];
    if (typeof type !== "string" || !validTypes.includes(type.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Invalid recommendation type. Allowed types: ${validTypes.join(", ")}.`,
      });
    }
    const cleanType = type.toLowerCase();

    // 2. Validate 'sid' if present
    let cleanSid = null;
    if (sid !== undefined && sid !== "") {
      const parsedSid = Number(sid);
      if (isNaN(parsedSid) || !Number.isInteger(parsedSid) || parsedSid < 0) {
        return res.status(400).json({
          success: false,
          error: "Invalid sid parameter. Must be a valid positive integer.",
        });
      }
      cleanSid = parsedSid;
    }

    // 3. Validate 'productId' if present
    let cleanProductId = null;
    if (productId !== undefined && productId !== "") {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid productId parameter. Must be a valid 24-character hexadecimal ObjectId.",
        });
      }
      cleanProductId = productId;
    }

    // 4. Validate and clamp 'limit' (1 - 12, default 6)
    let cleanLimit = 6;
    if (limit !== undefined && limit !== "") {
      const parsedLimit = Number(limit);
      if (isNaN(parsedLimit) || !Number.isInteger(parsedLimit)) {
        return res.status(400).json({
          success: false,
          error: "Invalid limit parameter. Must be an integer between 1 and 12.",
        });
      }
      cleanLimit = Math.max(1, Math.min(12, parsedLimit));
    }

    // 5. Retrieve recommendations from recommendation service
    const result = await getProductRecommendations({
      sid: cleanSid,
      productId: cleanProductId,
      type: cleanType,
      limit: cleanLimit,
    });

    // 6. Format products using existing formatProductResponse and attach verified reason
    const formattedProducts = (result.recommendations || []).map((p) => ({
      ...formatProductResponse(p),
      reason: p.reason || "Recommended item from BigMall catalog",
    }));

    return res.status(200).json({
      success: true,
      type: result.type,
      count: formattedProducts.length,
      recommendations: formattedProducts,
      aiSummary: result.aiSummary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while generating recommendations.",
    });
  }
};

module.exports = {
  chatWithAi,
  searchWithAi,
  getRecommendations,
  formatProductsForPrompt,
  formatProductResponse,
};
