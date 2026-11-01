import React, { useState, useEffect, useRef, useCallback } from "react";
import { sendAIChatMessage } from "../../api/ai";
import "./AIChatbot.css";

const GUEST_GREETINGS = {
  en: "👋 Welcome to **Bigmall**!\n\nI am your **AI Shopping Assistant**.\n\n✨ **Guest Features (Pre-Login)**:\n• 🔥 Explore **Today's Hot Deals & Discounts**\n• 🥬 Discover **Fresh Groceries, Fruits & Vegetables**\n• 🚚 Check **Delivery coverage, times & Store details**\n• 💳 Learn **How Bigmall Wallet & 1-click payments work**\n• 📞 Contact **Customer Support helpline**\n\n🔒 *To track your placed orders, check wallet balance, or cancel an order, please Sign In to your account.*",
  hi: "👋 **Bigmall** में आपका स्वागत है!\n\nमैं आपका **AI शॉपिंग असिस्टेंट** हूँ।\n\n✨ **लॉगिन से पहले उपलब्ध सुविधाएं**:\n• 🔥 **आज के बेस्ट ऑफर्स व डिस्काउंट** खोजें\n• 🥬 **ताज़ा फल, हरी सब्जियां व किराना सामान** देखें\n• 🚚 **डिलीवरी समय व स्टोर लोकेशन** जानें\n• 💳 **Bigmall Wallet व 1-क्लिक पेमेंट** की जानकारी\n• 📞 **कस्टमर केयर से संपर्क करें**\n\n🔒 *ऑर्डर ट्रैक करने या कैंसिल करने के लिए कृपया अपने अकाउंट में लॉगिन करें।*",
};

const AUTH_GREETINGS = {
  en: (name) =>
    `👋 Welcome back, **${name || "Shopper"}**!\n\nI am your **Bigmall AI Customer Support Assistant**.\n\n📦 **Your Account Features (Logged In)**:\n• 📦 **Track your orders** with live 6-milestone delivery status\n• 📋 **View your recent orders** and order history\n• ❌ **Cancel eligible un-delivered orders** with instant 100% wallet refund\n• 💳 **Check your Bigmall Wallet** balance & refund credits\n• 🚚 **Verify delivery addresses** and order details\n• 📞 **Direct customer care assistance**\n\nHow can I help you with your orders today?`,
  hi: (name) =>
    `👋 स्वागत है, **${name || "ग्राहक"}** जी!\n\nमैं आपका **Bigmall AI कस्टमर सपोर्ट असिस्टेंट** हूँ।\n\n📦 **लॉगिन के बाद उपलब्ध सुविधाएं**:\n• 📦 **अपने ऑर्डर लाइव ट्रैक करें** (6-चरणीय डिलीवरी स्थिति)\n• 📋 **अपने हाल के सभी ऑर्डर** देखें\n• ❌ **ऑर्डर कैंसिल करें** (100% तुरंत वॉलेट रिफंड)\n• 💳 **अपना वॉलेट बैलेंस** और रिफंड हिस्ट्री जांचें\n• 🚚 **डिलीवरी पता व ऑर्डर विवरण**\n• 📞 **कस्टमर केयर से सीधा संपर्क**\n\nआज मैं आपके ऑर्डर के लिए क्या सहायता करूँ?`,
};

const CHIPS_PRE_LOGIN = {
  en: [
    "🔥 Today's Deals",
    "🥬 Fresh Groceries",
    "🚚 Delivery & Store Info",
    "💳 How Wallet Works",
    "📞 Customer Care",
    "🔐 Sign In to Account",
  ],
  hi: [
    "🔥 आज के बेस्ट ऑफर्स",
    "🥬 ताज़ा फल-सब्जियां",
    "🚚 डिलीवरी व स्टोर पता",
    "💳 वॉलेट कैसे काम करता है",
    "📞 कस्टमर केयर",
    "🔐 अकाउंट में लॉगिन करें",
  ],
};

const CHIPS_POST_LOGIN = {
  en: [
    "📦 Track My Order",
    "📋 My Orders",
    "❌ Cancel An Order",
    "💳 My Wallet Balance",
    "🚚 Delivery & Returns",
    "📞 Customer Care",
    "🔥 Today's Deals",
  ],
  hi: [
    "📦 ऑर्डर ट्रैक करें",
    "📋 मेरे हाल के ऑर्डर",
    "❌ ऑर्डर कैंसिल करें",
    "💳 मेरा वॉलेट बैलेंस",
    "🚚 डिलीवरी व रिटर्न",
    "📞 कस्टमर केयर",
    "🔥 आज के बेस्ट ऑफर्स",
  ],
};

// Helper to determine auth state safely
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || token === "null" || token === "undefined" || token === "false") {
      return { isAuthenticated: false, user: null };
    }
    const user = userStr && userStr !== "null" && userStr !== "undefined" ? JSON.parse(userStr) : null;
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false, user: null };
  }
};

const getChatStorageKey = (isAuth, userObj) => {
  if (isAuth && userObj && (userObj._id || userObj.id || userObj.email)) {
    const uid = userObj._id || userObj.id || userObj.email;
    return `bigmall_ai_chat_user_${uid}`;
  }
  return "bigmall_ai_chat_guest";
};

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPill, setShowPill] = useState(true);
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("bigmall_ai_chat_lang") || "en";
  });
  const [confirmCancelId, setConfirmCancelId] = useState(null);

  // Authentication state
  const [authState, setAuthState] = useState(getStoredAuth);
  const { isAuthenticated, user } = authState;
  const userName = user?.name || "";

  // Active storage key based on authentication
  const activeStorageKey = getChatStorageKey(isAuthenticated, user);

  // Load initial messages for active session
  const loadMessages = useCallback((isAuth, userObj, lang) => {
    const key = getChatStorageKey(isAuth, userObj);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }

    const greeting = isAuth
      ? AUTH_GREETINGS[lang]?.(userObj?.name) || AUTH_GREETINGS.en(userObj?.name)
      : GUEST_GREETINGS[lang] || GUEST_GREETINGS.en;

    return [
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  }, []);

  const [messages, setMessages] = useState(() => {
    const initialAuth = getStoredAuth();
    const initialLang = localStorage.getItem("bigmall_ai_chat_lang") || "en";
    return loadMessages(initialAuth.isAuthenticated, initialAuth.user, initialLang);
  });

  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Detect login/logout state changes whenever chat is opened or storage updates
  useEffect(() => {
    const syncAuth = () => {
      const current = getStoredAuth();
      if (
        current.isAuthenticated !== authState.isAuthenticated ||
        current.user?.email !== authState.user?.email
      ) {
        setAuthState(current);
        setMessages(loadMessages(current.isAuthenticated, current.user, language));
        setConfirmCancelId(null);
      }
    };

    syncAuth();
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [isOpen, authState, language, loadMessages]);

  // Auto-scroll when messages change or loading starts
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // Persist messages strictly under active storage key
  useEffect(() => {
    try {
      localStorage.setItem(activeStorageKey, JSON.stringify(messages));
    } catch {
      // ignore quota storage errors
    }
  }, [messages, activeStorageKey]);

  // Persist language preference
  useEffect(() => {
    localStorage.setItem("bigmall_ai_chat_lang", language);
  }, [language]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowPill(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const toggleLanguage = () => {
    const nextLang = language === "en" ? "hi" : "en";
    setLanguage(nextLang);

    if (messages.length <= 1) {
      const greeting = isAuthenticated
        ? AUTH_GREETINGS[nextLang]?.(userName) || AUTH_GREETINGS.en(userName)
        : GUEST_GREETINGS[nextLang] || GUEST_GREETINGS.en;

      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const clearChat = () => {
    const greeting = isAuthenticated
      ? AUTH_GREETINGS[language]?.(userName) || AUTH_GREETINGS.en(userName)
      : GUEST_GREETINGS[language] || GUEST_GREETINGS.en;

    const freshMessages = [
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ];
    setMessages(freshMessages);
    setLastFailedMessage(null);
    setConfirmCancelId(null);
    localStorage.removeItem(activeStorageKey);
  };

  const handleSignOutFromChat = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(activeStorageKey);
    const guestAuth = { isAuthenticated: false, user: null };
    setAuthState(guestAuth);
    setMessages(loadMessages(false, null, language));
    setConfirmCancelId(null);
    alert(language === "hi" ? "आप सफलतापूर्वक साइन आउट हो चुके हैं।" : "Signed out successfully.");
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText !== null ? customText : inputMessage).trim();
    if (!textToSend || isLoading) return;

    // Special chip trigger: Sign In button in guest mode
    if (textToSend === "🔐 Sign In to Account" || textToSend === "🔐 अकाउंट में लॉगिन करें" || textToSend === "🔐 Sign In") {
      window.location.href = "/signin";
      return;
    }

    setConfirmCancelId(null);

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);
    setLastFailedMessage(null);

    const historyPayload = messages
      .filter((m) => !m.isError)
      .slice(-8)
      .map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      }));

    try {
      const response = await sendAIChatMessage({
        message: textToSend,
        messages: historyPayload,
        language,
      });

      if (response.data && response.data.reply) {
        // Sync user authentication if backend resolved it
        if (response.data.user?.name && !isAuthenticated) {
          setAuthState({ isAuthenticated: true, user: response.data.user });
        }

        const isAuthReq = Boolean(response.data.requiresLogin);

        const assistantMsg = {
          id: `bot-${Date.now()}`,
          role: "assistant",
          content: response.data.reply,
          // Only attach orders/action result if user is actually authenticated
          orders: isAuthenticated && !isAuthReq ? response.data.orders || [] : [],
          selectedOrder: isAuthenticated && !isAuthReq ? response.data.selectedOrder || null : null,
          actionResult: isAuthenticated && !isAuthReq ? response.data.actionResult || null : null,
          requiresLogin: isAuthReq,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("No response content received from assistant.");
      }
    } catch (err) {
      console.error("AI Chat error:", err);
      let errorText =
        language === "hi"
          ? "क्षमा करें, AI असिस्टेंट से संपर्क करने में समस्या हुई।"
          : "Sorry, couldn't reach the AI assistant.";

      if (err.response?.data?.message) {
        errorText = err.response.data.message;
      } else if (err.message) {
        errorText = err.message;
      }

      setLastFailedMessage(textToSend);

      const errorMsg = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: errorText,
        isError: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const requestCancelOrder = (order) => {
    setConfirmCancelId(order.orderId);
  };

  const executeCancelConfirmed = (orderId) => {
    setConfirmCancelId(null);
    handleSendMessage(`Cancel order ${orderId}`);
  };

  const renderFormattedText = (text) => {
    if (!text) return "";
    const lines = text.split("\n");
    return lines.map((line, lIdx) => {
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
      return (
        <span key={lIdx}>
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={pIdx}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith("`") && part.endsWith("`")) {
              return (
                <code key={pIdx} className="bigmall-inline-code">
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          })}
          {lIdx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  const getStatusStepPercentage = (status, statusStep) => {
    if (status === "Cancelled") return -1;
    if (typeof statusStep === "number" && statusStep >= 0) {
      return Math.min(100, Math.round((statusStep / 5) * 100));
    }
    if (status === "Delivered") return 100;
    if (status === "Out For Delivery") return 80;
    if (status === "Shipped") return 60;
    if (status === "Packed") return 40;
    if (status === "Processing") return 20;
    return 10;
  };

  const renderOrderCard = (order) => {
    if (!order) return null;
    const isCancelled = order.status === "Cancelled";
    const isDelivered = order.status === "Delivered";
    const canCancel = !isCancelled && !isDelivered;
    const progress = getStatusStepPercentage(order.status, order.statusStep);

    return (
      <div key={order.orderId || order._id} className="bigmall-order-card">
        <div className="bigmall-order-header">
          <div className="bigmall-order-id-badge">
            <i className="fa fa-shopping-bag me-1" aria-hidden="true"></i>
            <span>{order.orderId}</span>
          </div>
          <span
            className={`bigmall-status-pill ${
              isDelivered
                ? "status-delivered"
                : isCancelled
                ? "status-cancelled"
                : "status-active"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="bigmall-order-body">
          {order.product_pic && (
            <img
              src={order.product_pic}
              alt={order.subcategory_name}
              className="bigmall-order-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}
          <div className="bigmall-order-details">
            <h6 className="bigmall-order-title">{order.subcategory_name}</h6>
            <div className="bigmall-order-meta">
              <span>Qty: <b>{order.quantity}</b></span>
              <span>•</span>
              <span className="bigmall-order-price">₹{order.total_price}</span>
            </div>
            {order.added_date && (
              <div className="bigmall-order-date">
                <i className="fa fa-calendar-o me-1"></i> {order.added_date}
              </div>
            )}
          </div>
        </div>

        {/* Milestone Progress Bar */}
        {!isCancelled && (
          <div className="bigmall-progress-container">
            <div className="bigmall-progress-track">
              <div
                className="bigmall-progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="bigmall-progress-labels">
              <span>Confirmed</span>
              <span>Packed</span>
              <span>Delivered</span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="bigmall-order-actions">
          <button
            className="bigmall-order-btn-track"
            onClick={() => handleSendMessage(`Track order ${order.orderId}`)}
            disabled={isLoading}
          >
            <i className="fa fa-truck me-1"></i>
            {language === "hi" ? "ट्रैक करें" : "Track Status"}
          </button>

          {canCancel && confirmCancelId !== order.orderId && (
            <button
              className="bigmall-order-btn-cancel"
              onClick={() => requestCancelOrder(order)}
              disabled={isLoading}
            >
              <i className="fa fa-times-circle me-1"></i>
              {language === "hi" ? "कैंसिल करें" : "Cancel"}
            </button>
          )}
        </div>

        {/* Inline Cancel Confirmation Alert */}
        {confirmCancelId === order.orderId && (
          <div className="bigmall-cancel-confirm-box">
            <div className="bigmall-confirm-text">
              <i className="fa fa-exclamation-triangle text-danger me-1"></i>
              {language === "hi"
                ? `क्या आप ऑर्डर ${order.orderId} कैंसिल करना चाहते हैं? ₹${order.total_price} तुरंत आपके बिगमाल वॉलेट में रिफंड हो जाएगा।`
                : `Cancel order ${order.orderId}? ₹${order.total_price} will be refunded to your Bigmall Wallet instantly.`}
            </div>
            <div className="bigmall-confirm-btns">
              <button
                className="bigmall-confirm-yes"
                onClick={() => executeCancelConfirmed(order.orderId)}
                disabled={isLoading}
              >
                {language === "hi" ? "हाँ, कैंसिल करें" : "Yes, Cancel"}
              </button>
              <button
                className="bigmall-confirm-no"
                onClick={() => setConfirmCancelId(null)}
              >
                {language === "hi" ? "रद्द न करें" : "Keep Order"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Determine active quick chips based on login state
  const activeChips = isAuthenticated
    ? CHIPS_POST_LOGIN[language] || CHIPS_POST_LOGIN.en
    : CHIPS_PRE_LOGIN[language] || CHIPS_PRE_LOGIN.en;

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <>
          {showPill && (
            <div
              className="bigmall-launcher-pill"
              onClick={() => setIsOpen(true)}
              role="button"
              tabIndex={0}
            >
              <i className="fa fa-headphones" aria-hidden="true"></i>
              <span>{language === "hi" ? "AI कस्टमर सपोर्ट" : "AI Customer Support"}</span>
            </div>
          )}

          <button
            className="bigmall-chat-launcher"
            onClick={() => setIsOpen(true)}
            aria-label="Open Bigmall AI Support"
            title="Open Bigmall AI Support"
          >
            <span
              className={`bigmall-launcher-badge ${
                isAuthenticated ? "badge-auth" : "badge-guest"
              }`}
            ></span>
            <i className="fa fa-comments" aria-hidden="true"></i>
          </button>
        </>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="bigmall-chat-window" role="dialog" aria-modal="true">
          {/* Header */}
          <div className="bigmall-chat-header">
            <div className="bigmall-header-info">
              <div className="bigmall-avatar-icon">
                <i className="fa fa-headphones" aria-hidden="true"></i>
              </div>
              <div className="bigmall-header-title">
                <span className="bigmall-brand-title">Bigmall AI Customer Support</span>
                <span className="bigmall-online-sub">
                  <span
                    className={`bigmall-status-dot ${
                      isAuthenticated ? "dot-online" : "dot-guest"
                    }`}
                  ></span>
                  {isAuthenticated
                    ? userName
                      ? `👤 ${userName}`
                      : language === "hi"
                      ? "लॉगिन है | 24/7 सहायता"
                      : "Authenticated | 24/7 Support"
                    : language === "hi"
                    ? "गेस्ट मोड (लॉगिन से पहले)"
                    : "Guest Mode (Pre-Login)"}
                </span>
              </div>
            </div>

            <div className="bigmall-header-actions">
              {/* Language Switch */}
              <button
                className="bigmall-lang-btn"
                onClick={toggleLanguage}
                title="Switch Language / भाषा बदलें"
              >
                {language === "en" ? "हिन्दी" : "English"}
              </button>

              {/* Sign Out directly from chat if logged in */}
              {isAuthenticated && (
                <button
                  className="bigmall-icon-btn text-warning"
                  onClick={handleSignOutFromChat}
                  title={language === "hi" ? "साइन आउट करें" : "Sign Out"}
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                </button>
              )}

              {/* Clear Chat */}
              <button
                className="bigmall-icon-btn"
                onClick={clearChat}
                title={language === "hi" ? "बातचीत साफ़ करें" : "Clear Chat"}
              >
                <i className="fa fa-trash-o" aria-hidden="true"></i>
              </button>

              {/* Close Button */}
              <button
                className="bigmall-icon-btn"
                onClick={() => setIsOpen(false)}
                title={language === "hi" ? "बंद करें" : "Close"}
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {/* Mode Sub-Banner */}
          {!isAuthenticated && (
            <div className="bigmall-guest-banner">
              <i className="fa fa-info-circle me-1"></i>
              <span>
                {language === "hi"
                  ? "गेस्ट मोड: डील्स व उत्पाद पूछें। ऑर्डर व ट्रैकिंग के लिए "
                  : "Guest Mode: Browse deals & services. For orders, "}
              </span>
              <a href="/signin" className="bigmall-banner-login-link">
                {language === "hi" ? "लॉगिन करें →" : "Sign In →"}
              </a>
            </div>
          )}

          {/* Messages Body */}
          <div className="bigmall-chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`bigmall-msg-row ${msg.role === "user" ? "user" : "assistant"}`}
              >
                {msg.role === "assistant" && (
                  <div className="bigmall-msg-avatar">
                    <i className="fa fa-headphones" aria-hidden="true"></i>
                  </div>
                )}
                <div
                  className={`bigmall-msg-bubble ${
                    msg.isError ? "bigmall-error-bubble" : ""
                  }`}
                >
                  <div>{renderFormattedText(msg.content)}</div>

                  {/* Render Sign In Prompt Button if Login is Required */}
                  {msg.requiresLogin && (
                    <div className="bigmall-login-prompt-box">
                      <a href="/signin" className="bigmall-signin-btn">
                        <i className="fa fa-sign-in me-1"></i>
                        {language === "hi" ? "👉 अभी लॉगिन करें" : "👉 Sign In to Bigmall Account"}
                      </a>
                    </div>
                  )}

                  {/* Render Selected Order if present and authenticated */}
                  {isAuthenticated && msg.selectedOrder && renderOrderCard(msg.selectedOrder)}

                  {/* Render Multiple Orders List if returned and authenticated */}
                  {isAuthenticated &&
                    Array.isArray(msg.orders) &&
                    msg.orders.length > 0 &&
                    !msg.selectedOrder && (
                      <div className="bigmall-orders-list">
                        {msg.orders.slice(0, 3).map((ord) => renderOrderCard(ord))}
                      </div>
                    )}

                  {/* Action result banner */}
                  {isAuthenticated && msg.actionResult && msg.actionResult.success && (
                    <div className="bigmall-action-success-banner">
                      <i className="fa fa-check-circle me-1"></i>
                      <span>
                        {language === "hi"
                          ? `₹${msg.actionResult.refundAmount} वॉलेट में रिफंड | नया बैलेंस: ₹${msg.actionResult.newBalance}`
                          : `₹${msg.actionResult.refundAmount} refunded to Wallet | New Balance: ₹${msg.actionResult.newBalance}`}
                      </span>
                    </div>
                  )}

                  {msg.isError && lastFailedMessage && (
                    <button
                      className="bigmall-retry-btn"
                      onClick={() => handleSendMessage(lastFailedMessage)}
                    >
                      <i className="fa fa-refresh" aria-hidden="true"></i>
                      {language === "hi" ? "पुनः प्रयास करें" : "Retry"}
                    </button>
                  )}
                  <div className="bigmall-msg-time">{msg.timestamp}</div>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="bigmall-msg-row assistant">
                <div className="bigmall-msg-avatar">
                  <i className="fa fa-headphones" aria-hidden="true"></i>
                </div>
                <div className="bigmall-typing-indicator">
                  <span className="bigmall-typing-dot"></span>
                  <span className="bigmall-typing-dot"></span>
                  <span className="bigmall-typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="bigmall-quick-chips">
            {activeChips.map((chip, idx) => (
              <button
                key={idx}
                className="bigmall-chip-btn"
                onClick={() => handleSendMessage(chip)}
                disabled={isLoading}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Footer Input */}
          <div className="bigmall-chat-footer">
            <input
              ref={inputRef}
              type="text"
              className="bigmall-chat-input"
              placeholder={
                !isAuthenticated
                  ? language === "hi"
                    ? "डील्स, ताज़ा फल, स्टोर पता पूछें..."
                    : "Ask about deals, fresh groceries, store info..."
                  : language === "hi"
                  ? "ऑर्डर ट्रैकिंग, कैंसिलेशन, वॉलेट बैलेंस पूछें..."
                  : "Ask about tracking, cancel order, refunds, deals..."
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="bigmall-send-btn"
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              title={language === "hi" ? "भेजें" : "Send"}
            >
              <i className="fa fa-paper-plane" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;
