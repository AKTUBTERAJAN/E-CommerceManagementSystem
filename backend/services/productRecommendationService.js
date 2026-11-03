const Product = require("../models/Products");
const { getClient, isConfigured, GEMINI_MODEL } = require("./aiService");

/**
 * Complementary category mapping based on BigMall grocery catalog
 */
const COMPLEMENTARY_CATEGORIES = {
  3: [21, 8],     // Fruits -> Health Products, Cold Drinks
  8: [11, 3],     // Cold drinks -> Chips/Snacks, Fruits
  11: [8, 19],    // Chips/Snacks -> Cold Drinks, Paan Corner
  19: [8, 11],    // Paan Corner -> Cold Drinks, Chips
  20: [22],       // Oil -> Atta, Rice & Dal
  21: [3, 22],    // Health Products -> Fruits, Atta/Rice/Dal
  22: [20],       // Atta, Rice & Dal -> Oil
};

/**
 * In-memory TTL Cache
 * Key format: "type:sid:productId:limit"
 */
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCacheKey({ sid, productId, type, limit }) {
  return `${type || "foryou"}:${sid ?? ""}:${productId ?? ""}:${limit || 6}`;
}

function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setToCache(key, data) {
  // Prevent unbounded cache growth
  if (cache.size > 500) {
    const now = Date.now();
    for (const [k, v] of cache.entries()) {
      if (now > v.expiresAt) {
        cache.delete(k);
      }
    }
  }

  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

function clearCache() {
  cache.clear();
}

/**
 * Retrieve candidate products from MongoDB
 * @param {Object} options
 * @param {number|null} options.sid
 * @param {string|null} options.productId
 * @param {string} options.type
 * @param {number} options.limit
 * @returns {Promise<Array>}
 */
async function getCandidateProducts({ sid, productId, type, limit }) {
  const excludeFilter = productId ? { _id: { $ne: productId } } : {};
  let candidates = [];

  if (type === "deals") {
    // Priority: Items marked as deals or with highest discount
    candidates = await Product.find({
      ...excludeFilter,
      $or: [{ isDeal: true }, { total_discount: { $gt: 0 } }],
    })
      .sort({ total_discount: -1, discount_price: 1 })
      .limit(limit)
      .lean();
  } else if (type === "trending") {
    // Priority: Fresh arrivals or latest additions
    candidates = await Product.find({
      ...excludeFilter,
      $or: [{ isLatest: true }, { isFresh: true }],
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  } else if (type === "complementary") {
    // Priority: Products in complementary subcategories
    let targetSid = sid;
    if (targetSid === null && productId) {
      const baseProduct = await Product.findById(productId).select("sid").lean();
      if (baseProduct && baseProduct.sid !== undefined) {
        targetSid = baseProduct.sid;
      }
    }

    const compSids = targetSid !== null ? (COMPLEMENTARY_CATEGORIES[targetSid] || []) : [];
    if (compSids.length > 0) {
      candidates = await Product.find({
        ...excludeFilter,
        sid: { $in: compSids },
      })
        .limit(limit)
        .lean();
    }

    // If complementary category yielded fewer than limit, pick from other categories
    if (candidates.length < limit && targetSid !== null) {
      const existingIds = candidates.map((c) => c._id);
      if (productId) existingIds.push(productId);

      const additional = await Product.find({
        _id: { $nin: existingIds },
        sid: { $ne: targetSid },
      })
        .limit(limit - candidates.length)
        .lean();

      candidates.push(...additional);
    }
  } else {
    // Default: "foryou"
    const query = { ...excludeFilter };
    if (sid !== null) {
      query.sid = sid;
    } else {
      query.$or = [{ isForYouDeal: true }, { isForYouLatest: true }, { isDeal: true }];
    }

    candidates = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  // If candidate count is less than requested limit, backfill with general catalog items
  if (candidates.length < limit) {
    const existingIds = candidates.map((c) => c._id);
    if (productId) existingIds.push(productId);

    const backfill = await Product.find({
      _id: { $nin: existingIds },
    })
      .limit(limit - candidates.length)
      .lean();

    candidates.push(...backfill);
  }

  return candidates.slice(0, limit);
}

/**
 * Generate honest fallback reason for each candidate based on actual fields
 * @param {Object} product
 * @param {string} type
 * @returns {string}
 */
function generateFallbackReason(product, type) {
  if (product.total_discount && product.total_discount > 0) {
    return `${product.total_discount}% discount on this item`;
  }
  if (product.isDeal) {
    return "Featured deal in BigMall inventory";
  }
  if (product.isFresh) {
    return "Fresh grocery essential";
  }
  if (product.isLatest) {
    return "New arrival in BigMall catalog";
  }
  if (type === "complementary") {
    return "Complementary grocery pairing";
  }
  return "Recommended from BigMall catalog";
}

/**
 * Generate honest fallback summary
 * @param {string} type
 * @param {number} count
 * @returns {string}
 */
function generateFallbackSummary(type, count) {
  if (count === 0) {
    return "No matching products found for recommendations.";
  }
  switch (type) {
    case "deals":
      return `Found ${count} value deals with great discounts.`;
    case "trending":
      return `Found ${count} fresh arrivals and essentials.`;
    case "complementary":
      return `Found ${count} complementary grocery items.`;
    case "foryou":
    default:
      return `Curated ${count} grocery recommendations for you.`;
  }
}

/**
 * Optional Gemini enrichment for recommendation reasons and summary
 * @param {Object} params
 * @param {Array} params.candidates
 * @param {string} params.type
 * @param {number|null} params.sid
 * @returns {Promise<{ summary: string, reasons: Object } | null>}
 */
async function enrichWithGemini({ candidates, type, sid }) {
  if (!isConfigured() || !candidates || candidates.length === 0) {
    return null;
  }

  try {
    const client = getClient();
    if (!client) return null;

    // Send only minimal, non-sensitive product data (no PII, no internal costs)
    const minimalList = candidates.map((p) => ({
      id: p._id.toString(),
      name: p.subcategory_name,
      sid: p.sid,
      discount: p.total_discount || 0,
      price: p.discount_price,
    }));

    const systemPrompt = `You are a shopping recommendation assistant for BigMall grocery store.
Write a concise, honest 1-sentence recommendation reason for each provided grocery product based on its name and discount.
Also write a brief 1-sentence friendly summary.
Do not invent new products or IDs. Only reference the provided IDs.

Output strictly valid JSON in this format:
{
  "summary": "1-sentence summary",
  "reasons": {
    "<productId>": "Brief honest reason"
  }
}`;

    const completionPromise = client.chat.completions.create({
      model: GEMINI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Recommendation type: ${type}. Products: ${JSON.stringify(minimalList)}`,
        },
      ],
      max_tokens: 300,
      temperature: 0.2,
    });

    // 3-second timeout to prevent API latency
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini timeout")), 3000)
    );

    const completion = await Promise.race([completionPromise, timeoutPromise]);
    const raw = completion.choices?.[0]?.message?.content?.trim() || "{}";
    const cleanJson = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i);
    const parsed = JSON.parse(cleanJson);

    if (parsed && typeof parsed === "object" && typeof parsed.reasons === "object") {
      return parsed;
    }
    return null;
  } catch (err) {
    // Fail silently on Gemini error, rate limit, or timeout
    return null;
  }
}

/**
 * Main Product Recommendation Service
 * @param {Object} options
 * @param {number|null} options.sid
 * @param {string|null} options.productId
 * @param {string} options.type
 * @param {number} options.limit
 * @returns {Promise<{ success: boolean, type: string, count: number, recommendations: Array, aiSummary: string }>}
 */
async function getProductRecommendations({ sid = null, productId = null, type = "foryou", limit = 6 }) {
  const cacheKey = getCacheKey({ sid, productId, type, limit });
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // 1. Fetch real candidates from MongoDB
  const candidates = await getCandidateProducts({ sid, productId, type, limit });

  if (!candidates || candidates.length === 0) {
    const emptyResponse = {
      success: true,
      type,
      count: 0,
      recommendations: [],
      aiSummary: generateFallbackSummary(type, 0),
    };
    setToCache(cacheKey, emptyResponse);
    return emptyResponse;
  }

  // 2. Optional Gemini enrichment (handles unconfigured, timeout, quota limits gracefully)
  const geminiEnrichment = await enrichWithGemini({ candidates, type, sid });

  // 3. Assemble recommendations with validated reasons
  const candidateIdSet = new Set(candidates.map((c) => c._id.toString()));

  const recommendations = candidates.map((product) => {
    const pidStr = product._id.toString();
    let reason = null;

    if (geminiEnrichment?.reasons && candidateIdSet.has(pidStr) && geminiEnrichment.reasons[pidStr]) {
      const candidateReason = String(geminiEnrichment.reasons[pidStr]).trim();
      if (candidateReason.length > 0 && candidateReason.length <= 150) {
        reason = candidateReason;
      }
    }

    if (!reason) {
      reason = generateFallbackReason(product, type);
    }

    return {
      ...product,
      reason,
    };
  });

  const aiSummary =
    geminiEnrichment?.summary && typeof geminiEnrichment.summary === "string" && geminiEnrichment.summary.trim()
      ? geminiEnrichment.summary.trim()
      : generateFallbackSummary(type, recommendations.length);

  const response = {
    success: true,
    type,
    count: recommendations.length,
    recommendations,
    aiSummary,
  };

  setToCache(cacheKey, response);
  return response;
}

module.exports = {
  getProductRecommendations,
  getCandidateProducts,
  generateFallbackReason,
  generateFallbackSummary,
  COMPLEMENTARY_CATEGORIES,
  clearCache,
  getFromCache,
  setToCache,
};
