const Product = require("../models/Products");

/**
 * Common stop words to strip when extracting product keywords
 */
const STOP_WORDS = new Set([
  "show", "me", "products", "product", "items", "item", "do", "you", "have",
  "sell", "any", "please", "what", "is", "the", "price", "of", "can", "i",
  "get", "looking", "for", "in", "under", "below", "above", "rupees", "rs",
  "inr", "bucks", "store", "bigmall", "available", "list", "give", "tell",
  "about", "search", "find", "and", "or", "a", "an", "the", "with", "at",
  "to", "how", "much", "cost", "deals", "discount", "offer", "offers", "buy",
  "purchase", "want", "need", "hello", "hi", "hey", "some", "which", "are",
  "good", "morning", "afternoon", "evening", "there", "all", "does", "did"
]);

/**
 * Extract price constraints and search terms from user text
 * @param {string} query
 * @returns {{ maxPrice: number|null, minPrice: number|null, terms: string[] }}
 */
function extractSearchParams(query) {
  if (!query || typeof query !== "string") {
    return { maxPrice: null, minPrice: null, terms: [] };
  }

  const maxPriceMatch =
    query.match(/(?:under|below|less than|within|cheaper than|max(?:imum)?)\s*(?:rs\.?|rupees|inr|₹)?\s*(\d+(?:\.\d+)?)/i) ||
    query.match(/(\d+(?:\.\d+)?)\s*(?:rs\.?|rupees|inr|₹)?\s*(?:or less|and under|budget)/i);
  const maxPrice = maxPriceMatch ? parseFloat(maxPriceMatch[1]) : null;

  const minPriceMatch = query.match(/(?:above|over|more than|greater than|min(?:imum)?)\s*(?:rs\.?|rupees|inr|₹)?\s*(\d+(?:\.\d+)?)/i);
  const minPrice = minPriceMatch ? parseFloat(minPriceMatch[1]) : null;

  const terms = query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  return { maxPrice, minPrice, terms };
}

/**
 * Search MongoDB Products using user query
 * @param {string} queryText
 * @param {number} [limit=10]
 * @returns {Promise<Array>}
 */
async function searchProducts(queryText, limit = 10) {
  const { maxPrice, minPrice, terms } = extractSearchParams(queryText);
  const filter = {};

  if (maxPrice !== null && minPrice !== null) {
    filter.discount_price = { $gte: minPrice, $lte: maxPrice };
  } else if (maxPrice !== null) {
    filter.discount_price = { $lte: maxPrice };
  } else if (minPrice !== null) {
    filter.discount_price = { $gte: minPrice };
  }

  if (terms.length > 0) {
    const orConditions = [];
    for (const term of terms) {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      orConditions.push({ subcategory_name: { $regex: escaped, $options: "i" } });

      if (term.endsWith("s") && term.length > 3) {
        orConditions.push({ subcategory_name: { $regex: escaped.slice(0, -1), $options: "i" } });
      }

      const vowelPattern = escaped.replace(/[aeiou]/gi, "[aeiou]");
      if (vowelPattern !== escaped) {
        orConditions.push({ subcategory_name: { $regex: vowelPattern, $options: "i" } });
      }
    }
    filter.$or = orConditions;
  }

  return await Product.find(filter)
    .select("_id subcategory_name price discount_price total_discount product_quantity product_pic sid")
    .limit(limit)
    .lean();
}

module.exports = {
  extractSearchParams,
  searchProducts,
};
