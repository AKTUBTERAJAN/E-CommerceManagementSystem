const Order = require("../models/Order");

/**
 * BigMall Official Store Knowledge Base
 * Verified store details only - no invented hours or information
 */
const STORE_INFO = {
  name: "BigMall",
  address: "Plot No-55, Near Banthara Post Office, Kanpur Road, Banthara, Lucknow, Uttar Pradesh 226401",
  phones: ["+91 9653028979", "+91 7052435535"],
  email: "rajankushwaha819@gmail.com",
};

/**
 * Internal 6-stage order tracking milestones
 * Aligned strictly with Order model and Dashboard (0 to 5)
 */
const ORDER_STATUS_STEPS = {
  0: "Order Confirmed",
  1: "Processing",
  2: "Packed",
  3: "Shipped",
  4: "Out For Delivery",
  5: "Delivered",
};

/**
 * Extract Order ID from user text
 * Matches BM followed by digits/alphanumeric (e.g. BM1001, BM1712345678) or explicit order #
 * @param {string} text
 * @returns {string|null}
 */
function extractOrderId(text) {
  if (!text || typeof text !== "string") return null;

  // Pattern 1: BigMall Order IDs starting with BM followed by digits or alphanumeric
  const bmMatch = text.match(/\b(BM[a-zA-Z0-9_-]{2,})\b/i);
  if (bmMatch) {
    return bmMatch[1].toUpperCase();
  }

  // Pattern 2: Explicit "order id / order # / order number"
  const explicitMatch = text.match(/\border\s*(?:id|number|#)\s*[:#-]?\s*([a-zA-Z0-9_-]{3,})/i);
  if (explicitMatch) {
    const candidate = explicitMatch[1];
    const stopWords = ["status", "tracking", "history", "details", "cancellation", "return", "refund", "please"];
    if (!stopWords.includes(candidate.toLowerCase()) && /\d/.test(candidate)) {
      return candidate;
    }
  }

  // Pattern 3: "order #12345" or "order: 12345"
  const colonHashMatch = text.match(/\border\s*[:#]\s*([a-zA-Z0-9_-]{3,})/i);
  if (colonHashMatch && /\d/.test(colonHashMatch[1])) {
    return colonHashMatch[1];
  }

  return null;
}

/**
 * Sanitize order object to remove customer PII
 * @param {Object} order
 * @returns {Object}
 */
function sanitizeOrderData(order) {
  if (!order) return null;
  return {
    _id: order._id,
    orderId: order.orderId,
    subcategory_name: order.subcategory_name,
    product_quantity: order.product_quantity || "",
    quantity: order.quantity,
    discount_price: order.discount_price,
    total_price: order.total_price,
    added_date: order.added_date || "",
    status: order.status,
    statusStep: order.statusStep !== undefined ? order.statusStep : 0,
    cancelledAt: order.cancelledAt || null,
    product_pic: order.product_pic || "",
  };
}

/**
 * Classify cancellation inquiry
 * @param {string} text
 * @returns {boolean}
 */
function isCancellationInquiry(text) {
  const lower = text.toLowerCase();
  return (
    lower.includes("cancel order") ||
    lower.includes("cancellation policy") ||
    lower.includes("how to cancel") ||
    lower.includes("can i cancel") ||
    lower.includes("cancel my order") ||
    lower.includes("how can i cancel") ||
    lower.includes("cancellation")
  );
}

/**
 * Classify return/exchange/damaged-item inquiry
 * @param {string} text
 * @returns {boolean}
 */
function isReturnInquiry(text) {
  const lower = text.toLowerCase();
  return (
    lower.includes("return policy") ||
    lower.includes("can i return") ||
    lower.includes("return product") ||
    lower.includes("return item") ||
    lower.includes("return an item") ||
    lower.includes("exchange policy") ||
    lower.includes("can i exchange") ||
    lower.includes("replace product") ||
    lower.includes("replacement") ||
    lower.includes("how to return") ||
    lower.includes("damaged") ||
    lower.includes("defective") ||
    lower.includes("wrong item") ||
    lower.includes("incorrect item") ||
    lower.includes("broken item") ||
    lower.includes("expired")
  );
}

/**
 * Classify refund inquiry
 * @param {string} text
 * @returns {boolean}
 */
function isRefundInquiry(text) {
  const lower = text.toLowerCase();
  return (
    lower.includes("refund policy") ||
    lower.includes("how do refunds work") ||
    lower.includes("get refund") ||
    lower.includes("refund status") ||
    lower.includes("money back") ||
    lower.includes("wallet refund") ||
    lower.includes("when will i get my refund") ||
    lower.includes("refunds work")
  );
}

/**
 * Classify store contact / address / general support inquiry
 * @param {string} text
 * @returns {boolean}
 */
function isStoreInfoInquiry(text) {
  const lower = text.toLowerCase();
  return (
    lower.includes("what is bigmall") ||
    lower.includes("about bigmall") ||
    lower.includes("who is bigmall") ||
    lower.includes("where is bigmall") ||
    lower.includes("where is the store") ||
    lower.includes("store details") ||
    lower.includes("address") ||
    lower.includes("located") ||
    lower.includes("location") ||
    lower.includes("contact") ||
    lower.includes("phone number") ||
    lower.includes("mobile number") ||
    lower.includes("helpline") ||
    lower.includes("call us") ||
    lower.includes("email address") ||
    lower.includes("customer support") ||
    lower.includes("customer care") ||
    lower.includes("support contact") ||
    lower.includes("contact details") ||
    lower.includes("how to contact") ||
    lower.includes("how can i contact")
  );
}

/**
 * Classify if message is asking about orders or tracking
 * @param {string} text
 * @returns {boolean}
 */
function isOrderInquiry(text) {
  if (extractOrderId(text) !== null) {
    return true;
  }

  // If user asks about cancellation/returns/refunds/store info policies, do not treat as order tracking
  if (
    isCancellationInquiry(text) ||
    isReturnInquiry(text) ||
    isRefundInquiry(text) ||
    isStoreInfoInquiry(text)
  ) {
    return false;
  }

  const lower = text.toLowerCase();
  return (
    lower.includes("track my order") ||
    lower.includes("where is my order") ||
    lower.includes("where are my orders") ||
    lower.includes("order status") ||
    lower.includes("check my order") ||
    lower.includes("my orders") ||
    lower.includes("recent order") ||
    lower.includes("recent orders") ||
    lower.includes("track order") ||
    lower.includes("order tracking") ||
    lower.includes("delivery status") ||
    lower.includes("show my orders") ||
    lower.includes("list my orders")
  );
}

/**
 * Handle Order Inquiries deterministically
 * @param {Object} options
 * @param {string} options.message
 * @param {string|null} options.userId
 * @returns {Promise<Object>}
 */
async function handleOrderInquiry({ message, userId }) {
  // If guest, politely prompt to sign in (no private order data leaked)
  if (!userId) {
    return {
      type: "auth_required",
      reply:
        "To track your order or view order details, please sign in to your BigMall account. Once signed in, you can view your live order status and tracking milestones directly here or in your account Orders dashboard.",
      orderData: null,
    };
  }

  const orderId = extractOrderId(message);

  // Case 1: Specific Order ID provided
  if (orderId) {
    const order = await Order.findOne({ orderId, user: userId }).lean();

    if (!order) {
      return {
        type: "order_not_found",
        reply: `No matching order found for ID "${orderId}" under your account. Please check the order ID in your Orders dashboard or make sure you are signed in to the right account.`,
        orderData: null,
      };
    }

    const cleanOrder = sanitizeOrderData(order);
    const stepName = ORDER_STATUS_STEPS[cleanOrder.statusStep] || cleanOrder.status;

    if (cleanOrder.status === "Cancelled") {
      const cancelDate = cleanOrder.cancelledAt
        ? new Date(cleanOrder.cancelledAt).toLocaleDateString()
        : "cancellation";
      return {
        type: "order_cancelled",
        reply: `Order #${cleanOrder.orderId} is Cancelled.\n• Item: ${cleanOrder.subcategory_name}${cleanOrder.product_quantity ? ` (${cleanOrder.product_quantity})` : ""}\n• Total Price: ₹${cleanOrder.total_price}\n• Status: Cancelled\n• Refund: Credited to your BigMall Wallet on ${cancelDate}.`,
        orderData: cleanOrder,
      };
    }

    let reply = `📦 Live Tracking for Order #${cleanOrder.orderId}:\n`;
    reply += `• Item: ${cleanOrder.subcategory_name}${cleanOrder.product_quantity ? ` (${cleanOrder.product_quantity})` : ""}\n`;
    reply += `• Quantity: ${cleanOrder.quantity} | Total Price: ₹${cleanOrder.total_price}\n`;
    reply += `• Status: ${cleanOrder.status}\n`;
    reply += `• Milestone: Step ${cleanOrder.statusStep}/5 (${stepName})\n`;
    reply += `• Order Date: ${cleanOrder.added_date || "N/A"}`;

    if (cleanOrder.status === "Delivered" || cleanOrder.statusStep === 5) {
      reply += `\n\nYour order has been delivered! Delivered grocery items cannot be cancelled or returned under store policy. For any damaged, defective, or incorrect items, please contact customer support directly at ${STORE_INFO.phones[0]}, ${STORE_INFO.phones[1]}, or ${STORE_INFO.email}.`;
    } else {
      reply += `\n\nNote: You can cancel any undelivered order directly from your Orders dashboard in your account profile to receive an immediate refund to your BigMall Wallet.`;
    }

    return {
      type: "order_tracking",
      reply,
      orderData: cleanOrder,
    };
  }

  // Case 2: General order query without specific ID -> Return recent orders for this user
  const recentOrders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  if (!recentOrders || recentOrders.length === 0) {
    return {
      type: "orders_empty",
      reply:
        "You currently have no placed orders under your BigMall account. Explore our catalog to place your first order!",
      orderData: null,
    };
  }

  const sanitizedList = recentOrders.map(sanitizeOrderData);
  let reply = "📦 Here are your recent BigMall orders:\n\n";
  sanitizedList.forEach((o, index) => {
    reply += `${index + 1}. Order #${o.orderId} - ${o.subcategory_name} (₹${o.total_price})\n   Status: ${o.status}\n`;
  });
  reply += `\nTo view full milestone tracking for any order, reply with "Track order [Order ID]"!`;

  return {
    type: "recent_orders",
    reply,
    orderData: sanitizedList[0],
  };
}

/**
 * Handle Store Info inquiries deterministically
 * @returns {Object}
 */
function handleStoreInfoInquiry() {
  return {
    type: "store_info",
    reply: `🏢 BigMall Store & Customer Support Information:
BigMall is your online grocery supermarket for fresh groceries, daily essentials, and snacks at discount prices.

• Store Address: ${STORE_INFO.address}
• Phone: ${STORE_INFO.phones[0]}
• Phone: ${STORE_INFO.phones[1]}
• Email: ${STORE_INFO.email}

For any customer support inquiries, you can reach out directly via phone or email, or visit our Customer Support page.`,
    orderData: null,
  };
}

/**
 * Handle Return Policy inquiries deterministically
 * @returns {Object}
 */
function handleReturnInquiry() {
  return {
    type: "return_policy",
    reply: `🔄 BigMall Return Policy:
• Grocery & Food Items: Delivered grocery, fresh produce, and food items cannot be returned under existing store policy due to hygiene and food safety standards.
• Damaged, Incorrect, or Defective Items: If you receive a damaged, expired, defective, or incorrect product, please contact our support team immediately with your Order ID:
  - Phone: ${STORE_INFO.phones[0]}
  - Phone: ${STORE_INFO.phones[1]}
  - Email: ${STORE_INFO.email}
  - Store Address: ${STORE_INFO.address}
• Note: BigMall does not operate an automated return request portal or courier pickup for delivered groceries.`,
    orderData: null,
  };
}

/**
 * Handle Refund Policy inquiries deterministically
 * @returns {Object}
 */
function handleRefundInquiry() {
  return {
    type: "refund_policy",
    reply: `💳 BigMall Refund Policy:
• Cancellation Refunds: When an undelivered order is cancelled, the full order amount is credited immediately to your internal BigMall Wallet balance.
• Wallet Usage: Your BigMall Wallet balance can be used instantly to buy any products across BigMall.
• No External Gateway Refunds: BigMall does not process refunds to external bank accounts, debit cards, or credit card payment gateways. All refunds are credited directly to your internal BigMall Wallet.`,
    orderData: null,
  };
}

/**
 * Handle Cancellation Policy inquiries deterministically
 * @returns {Object}
 */
function handleCancellationInquiry() {
  return {
    type: "cancellation_policy",
    reply: `❌ BigMall Order Cancellation Policy:
• Undelivered Orders: You can cancel any undelivered order directly from your Orders dashboard in your account profile.
• Wallet Refund: When an undelivered order is cancelled, the full order amount is instantly refunded and credited to your internal BigMall Wallet.
• Delivered Orders: Once an order has reached "Delivered" status (Step 5), it cannot be cancelled.
• Note: BigMall does not process refunds to external payment gateways or bank accounts; all refunds are issued to your BigMall Wallet.`,
    orderData: null,
  };
}

/**
 * Main Customer Support Router
 * Detects intent and dispatches deterministic response, or returns null if query is product-related
 * @param {Object} options
 * @param {string} options.message
 * @param {string|null} options.userId
 * @returns {Promise<Object|null>}
 */
async function handleCustomerSupportInquiry({ message, userId }) {
  if (!message || typeof message !== "string") return null;

  // 1. If an explicit Order ID is present (e.g. "BM1001"), prioritize order lookup
  if (extractOrderId(message)) {
    return await handleOrderInquiry({ message, userId });
  }

  // 2. Cancellation Policy
  if (isCancellationInquiry(message)) {
    return handleCancellationInquiry();
  }

  // 3. Return, Exchange, or Damaged Items
  if (isReturnInquiry(message)) {
    return handleReturnInquiry();
  }

  // 4. Refund Policy
  if (isRefundInquiry(message)) {
    return handleRefundInquiry();
  }

  // 5. Store Information, Address, and Contacts
  if (isStoreInfoInquiry(message)) {
    return handleStoreInfoInquiry();
  }

  // 6. General Order Tracking / Recent Orders (without explicit ID, e.g. "track my order")
  if (isOrderInquiry(message)) {
    return await handleOrderInquiry({ message, userId });
  }

  // Not a customer support intent -> return null to proceed with product search / shopping chatbot
  return null;
}

module.exports = {
  handleCustomerSupportInquiry,
  handleOrderInquiry,
  handleStoreInfoInquiry,
  handleReturnInquiry,
  handleRefundInquiry,
  handleCancellationInquiry,
  extractOrderId,
  sanitizeOrderData,
  STORE_INFO,
  ORDER_STATUS_STEPS,
};
