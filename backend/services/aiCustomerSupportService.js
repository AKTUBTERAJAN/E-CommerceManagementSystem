const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const { getOpenAIClient, DEFAULT_MODEL } = require("../config/openai");

/**
 * Knowledge Base of Bigmall Services & Policies
 */
const BIGMALL_INFO = {
  name: "Bigmall",
  tagline: "Your Fresh & Fast E-Commerce Supermarket",
  storeAddress:
    "Plot No-55, Near by Banthara Post Office, Kanpur Road, Banthara, Lucknow, Uttar Pradesh 226401",
  phones: ["+91 9653028979", "+91 7052435535"],
  email: "rajankushwaha819@gmail.com",
  categories: [
    "Fresh Fruits & Vegetables (ताज़ा फल एवं सब्ज़ियां)",
    "Groceries & Staples (दालें, मसाले, आटा, तेल)",
    "Dairy, Snacks & Beverages",
    "Household & Cleaning Essentials",
    "Personal Care & Wellness",
    "Today's Deals & Discounts (छूट और ऑफर्स)",
  ],
  trackingSteps: [
    { step: 0, title: "Order Confirmed", desc: "Order placed and acknowledged" },
    { step: 1, title: "Processing", desc: "Items gathered at our fulfillment center" },
    { step: 2, title: "Packed", desc: "Packed in sanitized food-grade bags" },
    { step: 3, title: "Shipped", desc: "Dispatched with our local delivery courier" },
    { step: 4, title: "Out For Delivery", desc: "Delivery partner is en route to your address" },
    { step: 5, title: "Delivered", desc: "Handed over at your doorstep" },
  ],
  policies: {
    cancellation:
      "Orders can be cancelled anytime BEFORE they are marked as 'Delivered'. When an order is cancelled, 100% of the paid amount is instantly refunded directly to your Bigmall Wallet. Delivered orders cannot be cancelled.",
    modification:
      "Order items, quantities, or addresses cannot be modified once placed. If not yet delivered, you can cancel your order for an instant wallet refund and place a fresh order with your updated preferences.",
    refunds:
      "All refunds from cancelled orders are credited instantly and automatically to your Bigmall Wallet balance. Wallet funds can be used immediately for future purchases.",
    returns:
      "Online automated returns are not supported after delivery. If you received damaged, missing, or spoiled items, please submit a query on the Customer Support page or contact our support team at +91 9653028979 / rajankushwaha819@gmail.com with your Order ID for manual resolution or replacement.",
    payments:
      "Bigmall supports Bigmall Wallet (instant 1-click checkout and zero-wait refunds), UPI, debit/credit cards, and net banking.",
  },
};

class AICustomerSupportService {
  /**
   * Resolve user from JWT Bearer token
   * Strictly validates token against JWT_SECRET
   */
  async resolveUser(token) {
    if (!token || typeof token !== "string") {
      return { isAuthenticated: false, user: null };
    }

    try {
      const cleanToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();
      if (!cleanToken || cleanToken === "null" || cleanToken === "undefined" || cleanToken === "false") {
        return { isAuthenticated: false, user: null };
      }

      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET || "secretkey");
      if (!decoded || !decoded.id) {
        return { isAuthenticated: false, user: null };
      }

      const user = await User.findById(decoded.id).select("-password").lean();
      if (!user) {
        return { isAuthenticated: false, user: null };
      }

      return {
        isAuthenticated: true,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          mobile: user.mobile || "",
          address: user.address || "",
        },
      };
    } catch {
      return { isAuthenticated: false, user: null };
    }
  }

  /**
   * Fetch authenticated user's orders strictly isolated by user ID
   * Never exposes another user's orders
   */
  async getUserOrders(userId, limit = 10) {
    if (!userId) return [];
    try {
      const query = Order.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);
      return typeof query.lean === "function" ? await query.lean() : await query;
    } catch (err) {
      console.error("Error fetching user orders:", err);
      return [];
    }
  }

  /**
   * Find specific order strictly scoped to the requesting user
   * Returns null if order does not exist OR belongs to another user
   */
  async getUserOrderByOrderId(orderId, userId) {
    if (!orderId || !userId) return null;
    try {
      const cleanId = orderId.trim();
      const query = Order.findOne({ orderId: cleanId, user: userId });
      return typeof query.lean === "function" ? await query.lean() : await query;
    } catch (err) {
      console.error("Error fetching specific order:", err);
      return null;
    }
  }

  /**
   * Perform authorized cancellation and wallet refund
   * Never claims refund/cancellation succeeded unless DB operations succeed!
   */
  async cancelAndRefundOrder({ orderId, userId }) {
    if (!orderId || !userId) {
      return {
        success: false,
        reason: "invalid_params",
        message: "Order ID and authenticated user are required.",
      };
    }

    try {
      const cleanId = orderId.trim();
      // Strictly query with user ownership
      const existingOrder = await Order.findOne({ orderId: cleanId, user: userId });

      if (!existingOrder) {
        return {
          success: false,
          reason: "not_found",
          message: `Order "${cleanId}" was not found in your account.`,
        };
      }

      if (existingOrder.status === "Delivered") {
        return {
          success: false,
          reason: "already_delivered",
          order: existingOrder,
          message: `Order "${cleanId}" has already been delivered and cannot be cancelled online. Please contact support at ${BIGMALL_INFO.phones[0]} for assistance.`,
        };
      }

      if (existingOrder.status === "Cancelled") {
        return {
          success: false,
          reason: "already_cancelled",
          order: existingOrder,
          message: `Order "${cleanId}" is already cancelled. Refund of ₹${existingOrder.total_price} was previously credited to your Bigmall Wallet.`,
        };
      }

      // 1. Update Order atomically
      existingOrder.status = "Cancelled";
      existingOrder.statusStep = -1;
      existingOrder.cancelledAt = new Date();
      await existingOrder.save();

      // 2. Refund money to Bigmall Wallet atomically
      let wallet = await Wallet.findOne({ user: userId });
      if (!wallet) {
        wallet = await Wallet.create({
          user: userId,
          balance: 0,
          transactions: [],
        });
      }

      const refundAmount = Number(existingOrder.total_price) || 0;
      wallet.balance += refundAmount;
      wallet.transactions.unshift({
        amount: refundAmount,
        type: "Credit",
        status: "Success",
      });
      await wallet.save();

      return {
        success: true,
        order: existingOrder.toObject(),
        refundAmount,
        newBalance: wallet.balance,
        message: `Order "${cleanId}" was successfully cancelled. ₹${refundAmount} has been refunded to your Bigmall Wallet.`,
      };
    } catch (err) {
      console.error("Error executing cancelAndRefundOrder:", err);
      return {
        success: false,
        reason: "server_error",
        message: "Failed to process cancellation due to a database error. Please try again.",
      };
    }
  }

  /**
   * Extract potential order ID from user message (e.g. BM1730..., BM followed by digits)
   */
  extractOrderId(text) {
    if (!text || typeof text !== "string") return null;
    const match = text.match(/\b(BM\d+)\b/i);
    return match ? match[1].toUpperCase() : null;
  }

  /**
   * Determine user intent for support routing
   */
  detectIntent(text) {
    const lower = (text || "").toLowerCase();

    // Cancellation
    if (
      lower.includes("cancel") ||
      lower.includes("रद्द") ||
      lower.includes("कैंसिल") ||
      lower.includes("cancle")
    ) {
      return "cancel_order";
    }

    // Modification (address, item, quantity change)
    if (
      lower.includes("modify") ||
      /change.*(address|item|quantity|product|order|delivery)/i.test(lower) ||
      /update.*(address|item|quantity|product|order)/i.test(lower) ||
      lower.includes("बदलना") ||
      lower.includes("एड्रेस चेंज") ||
      lower.includes("पता बदलना") ||
      lower.includes("सामान बदलना")
    ) {
      return "modify_order";
    }

    // Order Tracking & Status
    if (
      lower.includes("track") ||
      /where.*(order|package|delivery)/i.test(lower) ||
      lower.includes("status") ||
      lower.includes("delivery status") ||
      lower.includes("ट्रैक") ||
      lower.includes("ऑर्डर कहां") ||
      lower.includes("कब आएगा") ||
      lower.includes("delivery date") ||
      lower.includes("expected delivery")
    ) {
      return "track_order";
    }

    // List Orders
    if (
      lower.includes("my order") ||
      lower.includes("recent order") ||
      lower.includes("show order") ||
      lower.includes("order list") ||
      lower.includes("all orders") ||
      lower.includes("मेरे ऑर्डर") ||
      lower.includes("ऑर्डर लिस्ट") ||
      lower.includes("ऑर्डर हिस्ट्री")
    ) {
      return "list_orders";
    }

    // Returns
    if (
      lower.includes("return") ||
      lower.includes("exchange") ||
      lower.includes("replace") ||
      lower.includes("वापस") ||
      lower.includes("रिटर्न") ||
      lower.includes("खराब सामान")
    ) {
      return "return_query";
    }

    // Refund & Wallet
    if (
      lower.includes("refund") ||
      lower.includes("wallet") ||
      lower.includes("रिफंड") ||
      lower.includes("वॉलेट") ||
      lower.includes("balance") ||
      lower.includes("बैलेंस")
    ) {
      return "refund_wallet";
    }

    // Contact & Support
    if (
      lower.includes("contact") ||
      lower.includes("phone") ||
      lower.includes("email") ||
      lower.includes("helpline") ||
      lower.includes("customer care") ||
      lower.includes("कॉल") ||
      lower.includes("संपर्क") ||
      lower.includes("सपोर्ट")
    ) {
      return "contact_info";
    }

    // Store & Services
    if (
      lower.includes("service") ||
      lower.includes("category") ||
      lower.includes("categories") ||
      lower.includes("fresh") ||
      lower.includes("groceries") ||
      lower.includes("deal") ||
      lower.includes("bigmall") ||
      lower.includes("क्या है") ||
      lower.includes("सर्विस")
    ) {
      return "services_info";
    }

    return "general";
  }

  /**
   * Main Support Query Processor
   * Handles user questions, authorization, actual order queries, and cancellations
   */
  async processSupportQuery({
    userMessage,
    messages = [],
    userContext = null,
    language = "en",
  }) {
    const isHindi = language === "hi";
    const text = userMessage || "";
    const intent = this.detectIntent(text);
    const mentionedOrderId = this.extractOrderId(text);
    const isAuthenticated = Boolean(userContext && userContext.isAuthenticated && userContext.user);
    const user = isAuthenticated ? userContext.user : null;

    let reply = "";
    let orders = [];
    let selectedOrder = null;
    let actionResult = null;

    // =========================================================================
    // CASE 1: Unauthenticated user asking about their personal orders or cancellation
    // Rule: Never expose personal or order information without authorization
    // =========================================================================
    const isPersonalQuery =
      ["cancel_order", "track_order", "list_orders"].includes(intent) ||
      Boolean(mentionedOrderId) ||
      (intent === "refund_wallet" && /my|मेरा|balance|बैलेंस|kitna/i.test(text)) ||
      /my order|my account|my profile|mera order|order status|where is my|track my|cancel my/i.test(text);

    if (!isAuthenticated && isPersonalQuery) {
      if (isHindi) {
        reply =
          "🔒 **लॉगिन आवश्यक है**\n\nअपने ऑर्डर का विवरण देखने, लाइव ट्रैक करने, ऑर्डर कैंसिल करने या वॉलेट बैलेंस जांचने के लिए कृपया अपने **Bigmall** खाते में साइन इन करें।\n\nलॉगिन करने से पहले आप ताज़ा फल, सब्ज़ियां, आज के डिस्काउंट ऑफर्स, डिलीवरी नियम या कस्टमर केयर सहायता के बारे में पूछ सकते हैं।";
      } else {
        reply =
          "🔒 **Login Required**\n\nTo view your personal orders, live tracking, order cancellation, and wallet balance, please **sign in** to your Bigmall account.\n\nAs a guest, you can explore today's deals, fresh grocery categories, store address, delivery timelines, and payment policies.";
      }
      return {
        reply,
        orders: [],
        selectedOrder: null,
        actionResult: null,
        user: { isAuthenticated: false },
        intent: "auth_required",
        requiresLogin: true,
      };
    }

    // =========================================================================
    // CASE 2: Order Cancellation Request by Authenticated User
    // Rule: Never claim cancellation or refund completed unless authorized API successfully performs it
    // =========================================================================
    if (isAuthenticated && intent === "cancel_order") {
      // Determine which order to cancel
      let targetOrderId = mentionedOrderId;

      if (!targetOrderId) {
        // Look up user's active cancellable orders
        const userOrders = await this.getUserOrders(user._id, 5);
        const cancellableOrders = userOrders.filter(
          (o) => o.status !== "Delivered" && o.status !== "Cancelled"
        );

        if (cancellableOrders.length === 0) {
          if (isHindi) {
            reply =
              "आपके खाते में वर्तमान में कोई ऐसा ऑर्डर नहीं है जिसे कैंसिल किया जा सके (सभी ऑर्डर या तो डिलीवर हो चुके हैं या पहले से कैंसिल हैं)।\n\nयदि आपके पास कोई विशिष्ट Order ID है, तो कृपया 'Cancel order BM...' लिखकर भेजें।";
          } else {
            reply =
              "You currently have no active orders eligible for cancellation. (All existing orders are either already Delivered or Cancelled).\n\nIf you have a specific order in mind, please mention the Order ID (e.g. `Cancel order BM...`).";
          }
          return {
            reply,
            orders: userOrders,
            selectedOrder: null,
            actionResult: null,
            user: { isAuthenticated: true, name: user.name },
            intent,
          };
        }

        // If user has exactly one active order, we can prompt or target it
        if (cancellableOrders.length === 1) {
          targetOrderId = cancellableOrders[0].orderId;
        } else {
          // Multiple active orders, ask user to specify
          orders = cancellableOrders;
          if (isHindi) {
            reply = `आपके पास **${cancellableOrders.length}** सक्रिय ऑर्डर हैं। कृपया बताएं कि आप कौन सा ऑर्डर कैंसिल करना चाहते हैं:\n\n${cancellableOrders
              .map(
                (o) =>
                  `• **${o.orderId}**: ${o.subcategory_name} (₹${o.total_price}) - स्थिति: *${o.status}*`
              )
              .join("\n")}\n\nरद्द करने के लिए ऑर्डर आईडी लिखें (उदा. 'Cancel ${cancellableOrders[0].orderId}')।`;
          } else {
            reply = `You have **${cancellableOrders.length}** active orders. Which one would you like to cancel?\n\n${cancellableOrders
              .map(
                (o) =>
                  `• **${o.orderId}**: ${o.subcategory_name} (₹${o.total_price}) - Status: *${o.status}*`
              )
              .join("\n")}\n\nPlease reply with the Order ID (e.g., \`Cancel ${cancellableOrders[0].orderId}\`).`;
          }
          return {
            reply,
            orders: cancellableOrders,
            selectedOrder: null,
            actionResult: null,
            user: { isAuthenticated: true, name: user.name },
            intent,
          };
        }
      }

      // Execute authorized cancellation & wallet refund
      const result = await this.cancelAndRefundOrder({
        orderId: targetOrderId,
        userId: user._id,
      });

      actionResult = result;
      selectedOrder = result.order || null;

      if (result.success) {
        if (isHindi) {
          reply = `✅ **ऑर्डर सफलतापूर्वक कैंसिल कर दिया गया है!**\n\n• **ऑर्डर आईडी:** \`${targetOrderId}\`\n• **उत्पाद:** ${result.order?.subcategory_name || "आइटम"}\n• **रिफंड राशि:** ₹**${result.refundAmount}** (सीधे आपके Bigmall Wallet में जोड़ दी गई है)\n• **अपडेटेड वॉलेट बैलेंस:** ₹**${result.newBalance}**\n\nरिफंड की गई राशि का उपयोग आप अगली खरीदारी में तुरंत कर सकते हैं।`;
        } else {
          reply = `✅ **Order Cancelled Successfully!**\n\n• **Order ID:** \`${targetOrderId}\`\n• **Item:** ${result.order?.subcategory_name || "Item"}\n• **Refund Processed:** ₹**${result.refundAmount}** (credited immediately to your Bigmall Wallet)\n• **Updated Wallet Balance:** ₹**${result.newBalance}**\n\nYou can use your refunded wallet balance instantly on any future Bigmall purchase.`;
        }
      } else {
        // Specific truthful reason
        if (result.reason === "already_delivered") {
          reply = isHindi
            ? `❌ **ऑर्डर कैंसिल नहीं किया जा सकता**: ऑर्डर \`${targetOrderId}\` पहले ही डिलीवर हो चुका है। Bigmall नीति के अनुसार डिलीवर किए गए ऑर्डर ऑनलाइन कैंसिल नहीं हो सकते। सहायता के लिए हमारे सपोर्ट नंबर ${BIGMALL_INFO.phones[0]} पर कॉल करें।`
            : `❌ **Cannot Cancel Order**: Order \`${targetOrderId}\` has already been delivered. In accordance with Bigmall policy, delivered orders cannot be cancelled online. If there is a damaged item, please contact our support at ${BIGMALL_INFO.phones[0]}.`;
        } else if (result.reason === "already_cancelled") {
          reply = isHindi
            ? `ℹ️ ऑर्डर \`${targetOrderId}\` पहले से ही कैंसिल है। इसका रिफंड (₹${result.order?.total_price || 0}) पहले ही आपके Bigmall Wallet में जमा हो चुका है।`
            : `ℹ️ Order \`${targetOrderId}\` is already cancelled. The refund amount of ₹${result.order?.total_price || 0} was already credited to your Bigmall Wallet.`;
        } else if (result.reason === "not_found") {
          reply = isHindi
            ? `🔍 ऑर्डर \`${targetOrderId}\` आपके खाते में नहीं मिला। कृपया अपने 'My Orders' सेक्शन में जाकर सही ऑर्डर आईडी जांचें।`
            : `🔍 Order \`${targetOrderId}\` was not found in your account. Please check your My Orders section to verify your Order ID.`;
        } else {
          reply = isHindi
            ? `⚠️ ${result.message}`
            : `⚠️ ${result.message}`;
        }
      }

      return {
        reply,
        orders: [],
        selectedOrder,
        actionResult,
        user: { isAuthenticated: true, name: user.name },
        intent,
      };
    }

    // =========================================================================
    // CASE 3: Order Modification Query
    // Rule: Never claim modification completed, explain actual policy
    // =========================================================================
    if (intent === "modify_order") {
      if (isHindi) {
        reply =
          "📝 **ऑर्डर संशोधन नीति**: Bigmall में एक बार ऑर्डर कन्फर्म होने के बाद उसमें उत्पाद, मात्रा या पता सीधे संशोधित नहीं किया जा सकता।\n\n💡 **समाधान**: यदि आपका ऑर्डर अभी तक डिलीवर नहीं हुआ है, तो आप इसे तुरंत **कैंसिल** कर सकते हैं। पूरा पैसा तुरंत आपके Bigmall Wallet में रिफंड हो जाएगा और आप सही पते या उत्पादों के साथ नया ऑर्डर प्लेस कर सकते हैं।";
      } else {
        reply =
          "📝 **Order Modification Policy**: Bigmall does not support modifying items, quantities, or delivery addresses for orders that have already been placed.\n\n💡 **Recommended Solution**: If your order has not been delivered yet, you can cancel it for an instant 100% refund to your Bigmall Wallet, then place a fresh order with your updated preferences or delivery address.";
      }
      return {
        reply,
        orders: [],
        selectedOrder: null,
        actionResult: null,
        user: { isAuthenticated, name: user?.name },
        intent,
      };
    }

    // =========================================================================
    // CASE 4: Order Tracking & Status
    // Rule: Supported strictly by actual project data and milestone steps
    // =========================================================================
    if (isAuthenticated && intent === "track_order") {
      let targetOrder = null;

      if (mentionedOrderId) {
        targetOrder = await this.getUserOrderByOrderId(mentionedOrderId, user._id);
        if (!targetOrder) {
          reply = isHindi
            ? `🔍 ऑर्डर \`${mentionedOrderId}\` आपके खाते में नहीं मिला। कृपया अपने My Orders पेज में सही आईडी जांचें।`
            : `🔍 Order \`${mentionedOrderId}\` was not found in your Bigmall account. Please verify your Order ID from your My Orders page.`;
          return {
            reply,
            orders: [],
            selectedOrder: null,
            actionResult: null,
            user: { isAuthenticated: true, name: user.name },
            intent,
          };
        }
      } else {
        const userOrders = await this.getUserOrders(user._id, 1);
        if (userOrders.length === 0) {
          reply = isHindi
            ? "आपके Bigmall खाते में अभी कोई ऑर्डर नहीं मिला है। ताज़ा फल-सब्जियां या ग्रोसरी खरीदने के लिए हमारे प्रोडक्ट्स ब्राउज़ करें!"
            : "No orders found in your Bigmall account yet. Browse our Fresh Groceries or Today's Deals to place your first order!";
          return {
            reply,
            orders: [],
            selectedOrder: null,
            actionResult: null,
            user: { isAuthenticated: true, name: user.name },
            intent,
          };
        }
        targetOrder = userOrders[0];
      }

      selectedOrder = targetOrder;
      const stepIdx = typeof targetOrder.statusStep === "number" ? targetOrder.statusStep : 0;
      const isCancelled = targetOrder.status === "Cancelled";
      const isDelivered = targetOrder.status === "Delivered";

      if (isHindi) {
        reply = `📦 **ऑर्डर ट्रैकिंग विवरण**: \`${targetOrder.orderId}\`\n\n` +
          `• **आइटम:** ${targetOrder.subcategory_name} (मात्रा: ${targetOrder.quantity})\n` +
          `• **कुल राशि:** ₹${targetOrder.total_price} (${targetOrder.payment_method || "Wallet"})\n` +
          `• **वर्तमान स्थिति:** **${targetOrder.status}**\n` +
          `• **ऑर्डर दिनांक:** ${targetOrder.added_date || new Date(targetOrder.createdAt).toLocaleDateString()}\n` +
          `• **डिलीवरी पता:** ${targetOrder.customer?.address || "अकाउंट पता"}\n\n` +
          (isCancelled
            ? `❌ यह ऑर्डर कैंसिल हो चुका है और ₹${targetOrder.total_price} आपके वॉलेट में रिफंड कर दिए गए हैं।`
            : isDelivered
            ? `✅ यह ऑर्डर सफलतापूर्वक डिलीवर हो चुका है। आशा है आपको सामान पसंद आया!`
            : `🚚 **ट्रैकिंग स्टेज:** चरण ${Math.max(1, stepIdx + 1)} / 6 (${targetOrder.status})।\n${
                stepIdx < 5
                  ? "यदि आप चाहें, तो डिलीवरी से पहले इस ऑर्डर को कैंसिल भी कर सकते हैं।"
                  : ""
              }`);
      } else {
        reply = `📦 **Order Tracking Details**: \`${targetOrder.orderId}\`\n\n` +
          `• **Product:** ${targetOrder.subcategory_name} (Qty: ${targetOrder.quantity})\n` +
          `• **Total Price:** ₹${targetOrder.total_price} (Paid via ${targetOrder.payment_method || "Wallet"})\n` +
          `• **Current Status:** **${targetOrder.status}**\n` +
          `• **Order Date:** ${targetOrder.added_date || new Date(targetOrder.createdAt).toLocaleDateString()}\n` +
          `• **Delivery Address:** ${targetOrder.customer?.address || "Registered Address"}\n\n` +
          (isCancelled
            ? `❌ This order was cancelled and ₹${targetOrder.total_price} has been refunded to your Bigmall Wallet.`
            : isDelivered
            ? `✅ This order has been successfully delivered. Thank you for shopping with Bigmall!`
            : `🚚 **Milestone Progress:** Step ${Math.max(1, stepIdx + 1)} of 6 (${targetOrder.status}).\n${
                stepIdx < 5
                  ? "You can track real-time delivery or cancel this order prior to delivery for an instant wallet refund."
                  : ""
              }`);
      }

      return {
        reply,
        orders: [targetOrder],
        selectedOrder: targetOrder,
        actionResult: null,
        user: { isAuthenticated: true, name: user.name },
        intent,
      };
    }

    // =========================================================================
    // CASE 5: List Authenticated User's Orders
    // =========================================================================
    if (isAuthenticated && intent === "list_orders") {
      const userOrders = await this.getUserOrders(user._id, 10);
      orders = userOrders;

      if (userOrders.length === 0) {
        reply = isHindi
          ? "आपके Bigmall खाते में अभी कोई ऑर्डर नहीं मिला है।"
          : "You haven't placed any orders on Bigmall yet.";
      } else {
        if (isHindi) {
          reply = `📋 **आपके हाल के ऑर्डर** (${userOrders.length} पाए गए):\n\n` +
            userOrders
              .slice(0, 5)
              .map(
                (o, i) =>
                  `${i + 1}. **${o.subcategory_name}**\n   • ID: \`${o.orderId}\` | स्थिति: **${o.status}**\n   • राशि: ₹${o.total_price} | दिनांक: ${o.added_date || "हाल ही में"}`
              )
              .join("\n\n") +
            "\n\nकिसी विशेष ऑर्डर को ट्रैक करने के लिए लिखें: 'Track [OrderId]' या कैंसिल करने के लिए 'Cancel [OrderId]'।";
        } else {
          reply = `📋 **Your Recent Orders** (${userOrders.length} found):\n\n` +
            userOrders
              .slice(0, 5)
              .map(
                (o, i) =>
                  `${i + 1}. **${o.subcategory_name}**\n   • ID: \`${o.orderId}\` | Status: **${o.status}**\n   • Total: ₹${o.total_price} | Date: ${o.added_date || "Recent"}`
              )
              .join("\n\n") +
            "\n\nTo track any order, reply: `Track [OrderId]`. To cancel an eligible order, reply: `Cancel [OrderId]`.";
        }
      }

      return {
        reply,
        orders,
        selectedOrder: null,
        actionResult: null,
        user: { isAuthenticated: true, name: user.name },
        intent,
      };
    }

    // =========================================================================
    // CASE 6: Return & Replacement Policy Inquiry
    // Rule: Supported strictly by actual project data
    // =========================================================================
    if (intent === "return_query") {
      if (isHindi) {
        reply =
          "🔄 **रिटर्न और रिप्लेसमेंट नीति**:\n\n" +
          "1. **डिलीवरी से पहले:** आप अपने ऑर्डर को कभी भी कैंसिल कर सकते हैं। 100% राशि तुरंत आपके Bigmall Wallet में आ जाएगी।\n" +
          "2. **डिलीवरी के बाद:** खाद्य और ताज़ी वस्तुओं की गुणवत्ता व स्वच्छता बनाए रखने के लिए डिलीवर किए गए ऑर्डर ऑनलाइन ऑटो-रिटर्न नहीं होते।\n" +
          `3. **क्षतिग्रस्त या गलत सामान:** यदि आपको कोई खराब या गलत उत्पाद प्राप्त हुआ है, तो कृपया डिलीवरी के 24 घंटों के भीतर हमारे कस्टमर केयर से संपर्क करें:\n` +
          `   • 📞 फोन: ${BIGMALL_INFO.phones[0]} / ${BIGMALL_INFO.phones[1]}\n` +
          `   • ✉️ ईमेल: ${BIGMALL_INFO.email}\n` +
          `   • या हमारे **Customer Support** पेज पर फॉर्म भरें। हमारी टीम जांच के बाद तुरंत रिप्लेसमेंट या रिफंड की व्यवस्था करेगी।`;
      } else {
        reply =
          "🔄 **Bigmall Return & Replacement Policy**:\n\n" +
          "1. **Before Delivery:** You can cancel any un-delivered order for an immediate 100% refund to your Bigmall Wallet.\n" +
          "2. **After Delivery:** To maintain food safety and freshness standards, automated online returns are not supported for delivered groceries.\n" +
          `3. **Damaged, Spoiled, or Wrong Items:** If you received defective or incorrect products, please reach out to our support team within 24 hours of delivery:\n` +
          `   • 📞 Phone: ${BIGMALL_INFO.phones[0]} / ${BIGMALL_INFO.phones[1]}\n` +
          `   • ✉️ Email: ${BIGMALL_INFO.email}\n` +
          `   • Or submit a ticket on our **Customer Support** page. Our staff will quickly review and arrange a manual refund or product replacement.`;
      }

      return {
        reply,
        orders: [],
        selectedOrder: null,
        actionResult: null,
        user: { isAuthenticated, name: user?.name },
        intent,
      };
    }

    // =========================================================================
    // CASE 7: Refund & Wallet Inquiry
    // =========================================================================
    if (intent === "refund_wallet") {
      let walletBalance = null;
      if (isAuthenticated) {
        try {
          const wallet = await Wallet.findOne({ user: user._id }).lean();
          if (wallet) walletBalance = wallet.balance;
        } catch (err) {
          console.error("Error reading wallet:", err);
        }
      }

      if (isHindi) {
        reply =
          "💳 **Bigmall वॉलेट और रिफंड जानकारी**:\n\n" +
          (walletBalance !== null
            ? `💰 **आपका वर्तमान वॉलेट बैलेंस:** ₹**${walletBalance}**\n\n`
            : "") +
          "• **रिफंड नियम:** जब भी आप कोई ऑर्डर कैंसिल करते हैं, उसकी 100% राशि बिना किसी देरी के सीधे आपके Bigmall Wallet में जोड़ दी जाती है।\n" +
          "• **वॉलेट का उपयोग:** वॉलेट बैलेंस का इस्तेमाल आप तुरंत Bigmall के किसी भी उत्पाद (ताज़ा फल, सब्ज़ियां, दालें, दैनिक सामान) को खरीदने के लिए 1-क्लिक में कर सकते हैं।\n" +
          "• **वॉलेट टॉप-अप:** आप 'Wallet' पेज पर जाकर कभी भी पैसे जोड़ सकते हैं।";
      } else {
        reply =
          "💳 **Bigmall Wallet & Refund Policy**:\n\n" +
          (walletBalance !== null
            ? `💰 **Your Current Wallet Balance:** ₹**${walletBalance}**\n\n`
            : "") +
          "• **Instant Refunds:** Whenever you cancel an order before delivery, 100% of your payment is credited directly and immediately to your Bigmall Wallet.\n" +
          "• **Zero Waiting Time:** Wallet refunds have no bank clearance delays. The funds are available immediately at checkout.\n" +
          "• **Wallet Top-Up:** You can add money to your wallet anytime from the 'Wallet' tab in your account navigation.";
      }

      return {
        reply,
        orders: [],
        selectedOrder: null,
        actionResult: null,
        user: { isAuthenticated, name: user?.name },
        intent,
      };
    }

    // =========================================================================
    // CASE 8: Contact Information & Customer Care
    // =========================================================================
    if (intent === "contact_info") {
      if (isHindi) {
        reply =
          "📞 **Bigmall कस्टमर केयर संपर्क जानकारी**:\n\n" +
          `• 📍 **स्टोर पता:** ${BIGMALL_INFO.storeAddress}\n` +
          `• 📱 **कॉल करें:** ${BIGMALL_INFO.phones[0]} / ${BIGMALL_INFO.phones[1]}\n` +
          `• ✉️ **ईमेल:** ${BIGMALL_INFO.email}\n` +
          "• 🌐 **ऑनलाइन सहायता:** आप हमारे 'Customer Support' पेज पर जाकर सीधे संदेश भी भेज सकते हैं। हमारी सहायता टीम आपकी सेवा में सदैव तत्पर है!";
      } else {
        reply =
          "📞 **Bigmall Customer Support & Help Center**:\n\n" +
          `• 📍 **Store Address:** ${BIGMALL_INFO.storeAddress}\n` +
          `• 📱 **Call Us:** ${BIGMALL_INFO.phones[0]} or ${BIGMALL_INFO.phones[1]}\n` +
          `• ✉️ **Email Us:** ${BIGMALL_INFO.email}\n` +
          "• 🌐 **Direct Help:** You can also submit an inquiry anytime via our 'Customer Support' page. Our team responds promptly!";
      }

      return {
        reply,
        orders: [],
        selectedOrder: null,
        actionResult: null,
        user: { isAuthenticated, name: user?.name },
        intent,
      };
    }

    // =========================================================================
    // CASE 9: Bigmall Services & Store Info
    // =========================================================================
    if (intent === "services_info") {
      if (isHindi) {
        reply =
          "🛒 **Bigmall सेवाएँ और विशेषताएँ**:\n\n" +
          "Bigmall आपका विश्वसनीय ऑनलाइन सुपरमार्केट है, जहां आपको मिलता है:\n" +
          "• 🥬 **Fresh Produce:** रोज़ाना ताज़ा फल, हरी सब्ज़ियां और ऑर्गेनिक उत्पाद।\n" +
          "• 🌾 **किराना और मसाले:** प्रीमियम दालें, चावल, तेल, मसाले और दैनिक खाद्य सामग्री।\n" +
          "• 🔥 **Today's Deals:** प्रतिदिन 20% से 50% तक की भारी छूट और ऑफर्स।\n" +
          "• 🚚 **सुरक्षित व त्वरित डिलीवरी:** 6-चरणीय लाइव ऑर्डर ट्रैकिंग के साथ आपके दरवाज़े तक।\n" +
          "• 💳 **Bigmall Wallet:** 1-क्लिक भुगतान और ऑर्डर कैंसिल करने पर तुरंत रिफंड।\n" +
          `• 📍 **लोकेशन:** ${BIGMALL_INFO.storeAddress}`;
      } else {
        reply =
          "🛒 **About Bigmall Services & Offerings**:\n\n" +
          "Bigmall is your neighborhood one-stop grocery and department store, featuring:\n" +
          "• 🥬 **Fresh Groceries:** Farm-fresh fruits, green vegetables, dairy, and farm staples.\n" +
          "• 🌾 **Packaged Goods & Spices:** Top brands, pulses, grains, flour, oils, and snacks.\n" +
          "• 🔥 **Today's Deals:** Exclusive daily promotions with up to 50% savings.\n" +
          "• 🚚 **Live Order Tracking:** 6 transparent milestones from order confirmation to doorstep delivery.\n" +
          "• 💳 **Bigmall Wallet:** Fast 1-click checkout with instant refunds on eligible cancellations.\n" +
          `• 📍 **Store Location:** Lucknow, Uttar Pradesh.`;
      }

      return {
        reply,
        orders: [],
        selectedOrder: null,
        actionResult: null,
        user: { isAuthenticated, name: user?.name },
        intent,
      };
    }

    // =========================================================================
    // CASE 10: General queries - Try OpenAI if configured, else provide smart fallback
    // =========================================================================
    try {
      const client = getOpenAIClient();

      // Formulate safe, isolated prompt
      const systemPrompt = `You are "Bigmall AI Customer Support", a friendly, truthful, and helpful assistant for Bigmall.
Store Facts:
- Bigmall offers fresh groceries, fruits, vegetables, staples, daily essentials, and deals.
- Address: ${BIGMALL_INFO.storeAddress}
- Phones: ${BIGMALL_INFO.phones.join(", ")} | Email: ${BIGMALL_INFO.email}
- Tracking: 6 milestones (Order Confirmed, Processing, Packed, Shipped, Out For Delivery, Delivered).
- Cancellation: Allowed only BEFORE delivery; 100% instant refund to Bigmall Wallet. Delivered orders cannot be cancelled online.
- Returns: Automated online returns are not supported for delivered groceries. Defective items can be escalated to support phone/email.
- Modifications: Order items or addresses cannot be modified once placed.
Strict Security Rules:
- NEVER reveal personal information of other users.
- ONLY reference the authenticated user's data provided below:
  User: ${isAuthenticated ? JSON.stringify({ name: user.name, email: user.email }) : "Unauthenticated Guest"}
- If the user is unauthenticated and asks about their orders, politely require them to sign in.
- Answer in ${isHindi ? "polite Hindi (Devanagari or natural Hinglish)" : "friendly, clear English"}.`;

      const formattedMessages = [{ role: "system", content: systemPrompt }];
      if (Array.isArray(messages) && messages.length > 0) {
        for (const m of messages.slice(-6)) {
          if (m.role && m.content) {
            formattedMessages.push({ role: m.role, content: String(m.content) });
          }
        }
      }
      formattedMessages.push({ role: "user", content: text });

      const completion = await client.chat.completions.create({
        model: DEFAULT_MODEL,
        messages: formattedMessages,
        temperature: 0.6,
        max_tokens: 450,
      });

      const aiReply = completion.choices?.[0]?.message?.content;
      if (aiReply) {
        return {
          reply: aiReply,
          orders: [],
          selectedOrder: null,
          actionResult: null,
          user: { isAuthenticated, name: user?.name },
          intent,
        };
      }
    } catch {
      // Fallback if OpenAI not configured or fails
    }

    // Default polite customer support guidance
    if (isHindi) {
      reply =
        "👋 नमस्ते! मैं **Bigmall AI कस्टमर सपोर्ट** हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?\n\n" +
        "आप मुझसे पूछ सकते हैं:\n" +
        "• 📦 'मेरे ऑर्डर दिखाएं' या 'ऑर्डर ट्रैक करें'\n" +
        "• ❌ 'ऑर्डर कैंसिल कैसे करें?'\n" +
        "• 💳 'वॉलेट बैलेंस या रिफंड की जानकारी'\n" +
        "• 🥬 'ताज़ा फल और आज के ऑफर्स'\n" +
        "• 📞 'कस्टमर केयर नंबर'";
    } else {
      reply =
        "👋 Hello! I am your **Bigmall AI Customer Support Assistant**. How can I help you today?\n\n" +
        "You can ask me about:\n" +
        "• 📦 **Order Tracking & Delivery Status** (e.g., `Track my order`)\n" +
        "• ❌ **Order Cancellation & Instant Wallet Refunds**\n" +
        "• 💳 **Bigmall Wallet Balance & Payments**\n" +
        "• 🥬 **Fresh Groceries & Today's Deals**\n" +
        "• 📞 **Customer Care & Store Contact Details**";
    }

    return {
      reply,
      orders: [],
      selectedOrder: null,
      actionResult: null,
      user: { isAuthenticated, name: user?.name },
      intent,
    };
  }

  /**
   * Return structured FAQ on Bigmall services
   */
  getFAQList(language = "en") {
    const isHi = language === "hi";
    if (isHi) {
      return [
        {
          id: "faq-1",
          question: "मैं अपना ऑर्डर कैसे ट्रैक कर सकता हूँ?",
          answer:
            "आप अपने डैशबोर्ड के 'My Orders' में जाकर 'Track Order' पर क्लिक कर सकते हैं, या इस AI असिस्टेंट से सीधे 'Track my order' पूछ सकते हैं। हम 6 चरणों में लाइव ट्रैकिंग प्रदान करते हैं: कन्फर्म, प्रोसेसिंग, पैक्ड, शिप्ड, आउट फॉर डिलीवरी, और डिलीवर्ड।",
          category: "tracking",
        },
        {
          id: "faq-2",
          question: "क्या मैं अपना ऑर्डर कैंसिल कर सकता हूँ? रिफंड कैसे मिलेगा?",
          answer:
            "हाँ! आप डिलीवरी से पहले किसी भी समय अपना ऑर्डर कैंसिल कर सकते हैं। ऑर्डर कैंसिल होते ही पूरी राशि (100%) तुरंत आपके Bigmall Wallet में जोड़ दी जाती है, जिसे आप तुरंत अगली खरीदारी में उपयोग कर सकते हैं।",
          category: "cancellation",
        },
        {
          id: "faq-3",
          question: "क्या डिलीवरी के बाद सामान वापस (Return) किया जा सकता है?",
          answer:
            "खाद्य सामग्री और ताज़ी सब्जियों की स्वच्छता और सुरक्षा मानकों के कारण डिलीवरी के बाद ऑटोमेटेड ऑनलाइन रिटर्न संभव नहीं है। यदि कोई सामान खराब या गलत निकलता है, तो 24 घंटों में हमारे कस्टमर केयर नंबर (+91 9653028979) या सपोर्ट फॉर्म द्वारा संपर्क करें।",
          category: "returns",
        },
        {
          id: "faq-4",
          question: "क्या ऑर्डर प्लेस करने के बाद उसमें सामान या पता बदला जा सकता है?",
          answer:
            "ऑर्डर प्लेस होने के बाद उसमें सामान या डिलीवरी एड्रेस सीधे संशोधित नहीं किया जा सकता। यदि ऑर्डर अभी डिलीवर नहीं हुआ है, तो आप इसे कैंसिल करके तुरंत वॉलेट रिफंड पा सकते हैं और सही पते पर नया ऑर्डर प्लेस कर सकते हैं।",
          category: "modification",
        },
        {
          id: "faq-5",
          question: "Bigmall स्टोर कहां स्थित है और संपर्क कैसे करें?",
          answer:
            "हमारा स्टोर प्लॉट नंबर 55, बंथरा पोस्ट ऑफिस के पास, कानपुर रोड, लखनऊ, उत्तर प्रदेश 226401 में स्थित है। आप हमें +91 9653028979 या +91 7052435535 पर कॉल कर सकते हैं।",
          category: "store",
        },
      ];
    }

    return [
      {
        id: "faq-1",
        question: "How do I track my Bigmall order?",
        answer:
          "You can track your order anytime from the 'My Orders' section by clicking 'Track Order', or simply ask this AI assistant: 'Track my order'. Bigmall provides transparent 6-stage tracking from Order Confirmed to Doorstep Delivery.",
        category: "tracking",
      },
      {
        id: "faq-2",
        question: "Can I cancel my order, and how does the refund work?",
        answer:
          "Yes! You can cancel any order anytime BEFORE it is marked as 'Delivered'. Upon cancellation, 100% of your paid amount is instantly refunded directly to your Bigmall Wallet. There is zero waiting time, and wallet funds can be used immediately.",
        category: "cancellation",
      },
      {
        id: "faq-3",
        question: "What is Bigmall's return policy for delivered items?",
        answer:
          "To preserve grocery hygiene and quality, automated online returns are not supported after delivery. If you receive a damaged, defective, or spoiled item, please contact our helpline (+91 9653028979) or submit an inquiry on the Customer Support page within 24 hours.",
        category: "returns",
      },
      {
        id: "faq-4",
        question: "Can I modify items or delivery address on a placed order?",
        answer:
          "Placed orders cannot be modified directly. If your order has not been delivered yet, you can cancel it for an instant wallet refund and place a fresh order with your updated address or items.",
        category: "modification",
      },
      {
        id: "faq-5",
        question: "Where is Bigmall located, and what is the helpline?",
        answer:
          "Bigmall is located at Plot No-55, Near Banthara Post Office, Kanpur Road, Banthara, Lucknow, UP 226401. You can call our customer support team at +91 9653028979 / +91 7052435535 or email rajankushwaha819@gmail.com.",
        category: "store",
      },
    ];
  }
}

module.exports = new AICustomerSupportService();
