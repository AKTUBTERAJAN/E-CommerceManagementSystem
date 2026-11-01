const jwt = require("jsonwebtoken");
const Product = require("../models/Products");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Watchlist = require("../models/Watchlist");
const aiService = require("../services/aiService");

/**
 * Execute smart search using AI parsing with fallback to regular regex search.
 * Searches actual MongoDB products collection.
 */
const executeSmartSearch = async (rawQuery, baseFilter = {}) => {
  const queryStr = (rawQuery || "").trim();
  if (!queryStr) {
    return await Product.find(baseFilter).sort({ createdAt: -1 });
  }

  // 1. Try AI natural-language parsing
  let aiParsed = null;
  try {
    aiParsed = await aiService.parseSearchQuery(queryStr);
  } catch (err) {
    console.warn("AI parseSearchQuery error:", err.message);
  }

  let products = [];

  if (aiParsed) {
    const aiFilter = { ...baseFilter };

    // Price limits
    if (aiParsed.minPrice !== null || aiParsed.maxPrice !== null) {
      aiFilter.discount_price = {};
      if (aiParsed.minPrice !== null) aiFilter.discount_price.$gte = aiParsed.minPrice;
      if (aiParsed.maxPrice !== null) aiFilter.discount_price.$lte = aiParsed.maxPrice;
    }

    // Boolean flags
    if (aiParsed.isDeal === true) aiFilter.isDeal = true;
    if (aiParsed.isFresh === true) aiFilter.isFresh = true;
    if (aiParsed.isLatest === true) aiFilter.isLatest = true;

    // Subcategory or keyword match
    if (aiParsed.keywords && aiParsed.keywords.length > 0) {
      const escaped = aiParsed.keywords.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      aiFilter.subcategory_name = { $regex: escaped, $options: "i" };
    }

    // Sort order
    let sortObj = { createdAt: -1 };
    if (aiParsed.sortBy === "price_asc") sortObj = { discount_price: 1 };
    else if (aiParsed.sortBy === "price_desc") sortObj = { discount_price: -1 };
    else if (aiParsed.sortBy === "discount_desc") sortObj = { total_discount: -1 };

    products = await Product.find(aiFilter).sort(sortObj);

    // If zero results, relax price or specific flags but keep keyword search
    if (products.length === 0 && aiParsed.keywords) {
      const relaxedFilter = {
        ...baseFilter,
        subcategory_name: {
          $regex: aiParsed.keywords.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
          $options: "i",
        },
      };
      products = await Product.find(relaxedFilter).sort(sortObj);
    }
  }

  // 2. Fallback to normal keyword search if AI returned null or 0 results
  if (!products || products.length === 0) {
    const fallbackFilter = { ...baseFilter };

    // Extract price number from patterns like "under 2000" or "below 500"
    const priceUnderMatch = queryStr.match(/(?:under|below|less than|<|rs\.?|inr)\s*(\d+)/i);
    if (priceUnderMatch && priceUnderMatch[1]) {
      fallbackFilter.discount_price = { $lte: Number(priceUnderMatch[1]) };
    }

    const stopWords = new Set([
      "under", "below", "above", "best", "affordable", "cheap", "for",
      "in", "with", "the", "a", "an", "of", "and", "rs", "inr", "show", "me", "find"
    ]);

    const words = queryStr
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, ""))
      .filter((w) => w.length > 1 && !stopWords.has(w.toLowerCase()));

    if (words.length > 0) {
      const regexTokens = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
      fallbackFilter.subcategory_name = { $regex: regexTokens, $options: "i" };
    } else {
      fallbackFilter.subcategory_name = {
        $regex: queryStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    products = await Product.find(fallbackFilter).sort({ createdAt: -1 });

    // If still 0 matches and price filter was attached, try keyword alone
    if (products.length === 0 && fallbackFilter.discount_price) {
      delete fallbackFilter.discount_price;
      products = await Product.find(fallbackFilter).sort({ createdAt: -1 });
    }
  }

  return products;
};

const getProducts = async (req, res) => {
  try {
    const { sid, latest, deals, fresh, foryoudeal, foryoulatest, search, q } = req.query;
    const filter = {};

    if (sid) filter.sid = Number(sid);
    if (latest === "true") filter.isLatest = true;
    if (deals === "true") filter.isDeal = true;
    if (fresh === "true") filter.isFresh = true;
    if (foryoudeal === "true") filter.isForYouDeal = true;
    if (foryoulatest === "true") filter.isForYouLatest = true;

    const queryStr = search || q;
    if (queryStr) {
      const products = await executeSmartSearch(queryStr, filter);
      return res.status(200).json(products);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const searchProducts = async (req, res) => {
  try {
    const queryStr = req.query.q || req.query.search || "";
    const products = await executeSmartSearch(queryStr);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * AI Personalized Recommendations
 * Considers user purchase history, cart items, categories, price, deals, and fresh availability.
 * Always returns actual MongoDB Product records.
 */
const getRecommendations = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;
    const { sid, productId } = req.query;

    // 1. Extract optional authenticated user
    let userId = null;
    try {
      if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
          userId = decoded.id || decoded._id;
        }
      }
    } catch {
      // Guest browsing
    }

    // 2. Fetch user shopping history if authenticated
    const userHistory = [];
    const userSids = new Set();
    const userProductIds = new Set();

    if (userId) {
      try {
        const [orders, cartItems, watchlistItems] = await Promise.all([
          Order.find({ user: userId }).select("subcategory_name discount_price quantity").sort({ createdAt: -1 }).limit(10),
          Cart.find({ user: userId }).populate("product", "subcategory_name discount_price sid").limit(10),
          Watchlist.find({ user: userId }).populate("product", "subcategory_name discount_price sid").limit(10),
        ]);

        orders.forEach((o) => {
          userHistory.push({
            type: "order",
            name: o.subcategory_name,
            price: o.discount_price,
          });
        });

        cartItems.forEach((c) => {
          if (c.product) {
            userHistory.push({
              type: "cart",
              name: c.product.subcategory_name,
              price: c.product.discount_price,
            });
            if (c.product.sid) userSids.add(c.product.sid);
            userProductIds.add(String(c.product._id));
          }
        });

        watchlistItems.forEach((w) => {
          if (w.product) {
            userHistory.push({
              type: "watchlist",
              name: w.product.subcategory_name,
              price: w.product.discount_price,
            });
            if (w.product.sid) userSids.add(w.product.sid);
            userProductIds.add(String(w.product._id));
          }
        });
      } catch (historyErr) {
        console.warn("Could not retrieve user history:", historyErr.message);
      }
    }

    // 3. Fetch candidate real products from MongoDB
    const candidateFilter = {};
    if (productId) {
      candidateFilter._id = { $ne: productId };
    }
    if (sid) {
      candidateFilter.sid = Number(sid);
    }

    const availableProducts = await Product.find(candidateFilter).sort({ createdAt: -1 }).limit(40);

    if (availableProducts.length === 0) {
      return res.status(200).json({
        success: true,
        personalized: false,
        reason: "No products available",
        products: [],
      });
    }

    const recommendedProducts = [];
    let reason = userHistory.length > 0
      ? "Recommended for you based on your shopping and order history"
      : "Recommended for you based on popular deals and trending essentials";
    const isPersonalized = userHistory.length > 0;

    // 4. Try AI recommendation ranking
    try {
      const aiRank = await aiService.rankRecommendations({
        userHistory,
        availableProducts,
        limit,
      });

      if (aiRank && Array.isArray(aiRank.recommendedIds) && aiRank.recommendedIds.length > 0) {
        const idMap = new Map(availableProducts.map((p) => [String(p._id), p]));
        for (const id of aiRank.recommendedIds) {
          if (idMap.has(id)) {
            recommendedProducts.push(idMap.get(id));
            idMap.delete(id);
          }
        }
        if (aiRank.reason) reason = aiRank.reason;
      }
    } catch (aiErr) {
      console.warn("AI recommendation ranking fallback:", aiErr.message);
    }

    // 5. Fallback or fill remaining slots using actual MongoDB data
    if (recommendedProducts.length < limit) {
      const usedIds = new Set(recommendedProducts.map((p) => String(p._id)));
      if (productId) usedIds.add(String(productId));

      // Priority 1: User's historical categories
      if (userSids.size > 0) {
        for (const prod of availableProducts) {
          if (!usedIds.has(String(prod._id)) && userSids.has(prod.sid)) {
            recommendedProducts.push(prod);
            usedIds.add(String(prod._id));
            if (recommendedProducts.length >= limit) break;
          }
        }
      }

      // Priority 2: High discount deals
      if (recommendedProducts.length < limit) {
        for (const prod of availableProducts) {
          if (!usedIds.has(String(prod._id)) && (prod.isDeal || prod.total_discount > 0)) {
            recommendedProducts.push(prod);
            usedIds.add(String(prod._id));
            if (recommendedProducts.length >= limit) break;
          }
        }
      }

      // Priority 3: Fresh essentials and latest products
      if (recommendedProducts.length < limit) {
        for (const prod of availableProducts) {
          if (!usedIds.has(String(prod._id))) {
            recommendedProducts.push(prod);
            usedIds.add(String(prod._id));
            if (recommendedProducts.length >= limit) break;
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      personalized: isPersonalized,
      reason,
      products: recommendedProducts.slice(0, limit),
    });
  } catch (error) {
    console.error("Error in getRecommendations:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSubcategories = async (req, res) => {
  try {
    const products = await Product.find({}).select("sid subcategory_name");
    const unique = new Map();

    products.forEach((product) => {
      if (product.sid && !unique.has(product.sid)) {
        unique.set(product.sid, {
          id: product.sid,
          subcategory_name: product.subcategory_name,
        });
      }
    });

    res.status(200).json(Array.from(unique.values()));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getRecommendations,
  addProduct,
  getSubcategories,
  executeSmartSearch,
};
