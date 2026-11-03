import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { sendChatMessage } from "../../api/ai";
import "./chatbot.css";

const QUICK_SUGGESTIONS = [
  "Track My Order",
  "Show Recent Orders",
  "Cancellation Policy",
  "Wallet Refund",
  "Return Policy",
  "Store Address",
  "Today's Deals",
];

const ORDER_STATUS_LABELS = {
  0: "Order Confirmed",
  1: "Processing",
  2: "Packed",
  3: "Shipped",
  4: "Out For Delivery",
  5: "Delivered",
};

const INITIAL_MESSAGE = {
  id: "welcome-msg",
  sender: "assistant",
  text: "Hello! Welcome to your BigMall Dashboard. I am your AI Shopping & Customer Support Assistant. How can I assist you today? You can ask me to track your orders, check recent orders, explain wallet refund and cancellation policies, provide store details, or recommend products!",
  products: [],
  supportType: null,
  orderData: null,
  time: formatTime(new Date()),
};

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function resolveImageUrl(pic) {
  if (!pic || typeof pic !== "string") return "";
  const trimmed = pic.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function getStatusBadgeClass(status) {
  if (!status) return "bigmall-ai-status-default";
  const s = status.toLowerCase();
  if (s.includes("delivered")) return "bigmall-ai-status-delivered";
  if (s.includes("cancel")) return "bigmall-ai-status-cancelled";
  if (s.includes("out for delivery") || s.includes("shipped")) {
    return "bigmall-ai-status-transit";
  }
  if (
    s.includes("packed") ||
    s.includes("processing") ||
    s.includes("confirmed")
  ) {
    return "bigmall-ai-status-processing";
  }
  return "bigmall-ai-status-default";
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleToggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsOpen(false);
    }
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleSend = async (messageText) => {
    const text = (messageText || inputMessage || "").trim();
    if (!text || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const data = await sendChatMessage(text);

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: data.reply || "Here is the information you requested:",
        products: Array.isArray(data.products) ? data.products : [],
        supportType: data.supportType || null,
        orderData: data.orderData || null,
        time: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: "assistant",
        text: "Sorry, I am unable to connect to the BigMall assistant right now. Please check back in a moment or visit our Customer Support page.",
        isError: true,
        products: [],
        supportType: null,
        orderData: null,
        time: formatTime(new Date()),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          className="bigmall-ai-launcher"
          onClick={handleToggleOpen}
          aria-label="Open BigMall AI Assistant"
          title="Chat with BigMall AI Assistant"
        >
          <i className="fa fa-comments" aria-hidden="true"></i>
          <span className="bigmall-ai-launcher-badge">AI</span>
        </button>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div
          className={`bigmall-ai-window ${
            isMinimized ? "bigmall-ai-minimized" : ""
          }`}
          role="dialog"
          aria-label="BigMall Assistant Window"
        >
          {/* Header */}
          <div
            className="bigmall-ai-header"
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div className="bigmall-ai-header-left">
              <div className="bigmall-ai-avatar">
                <i className="fa fa-shopping-bag" aria-hidden="true"></i>
              </div>
              <div className="bigmall-ai-header-info">
                <span className="bigmall-ai-header-title">
                  BigMall AI Assistant
                </span>
                <span className="bigmall-ai-header-status">
                  <span className="bigmall-ai-status-dot"></span> Dashboard Support
                </span>
              </div>
            </div>

            <div className="bigmall-ai-header-controls">
              <button
                className="bigmall-ai-control-btn"
                onClick={handleMinimize}
                title={isMinimized ? "Restore" : "Minimize"}
                aria-label={isMinimized ? "Restore Chat" : "Minimize Chat"}
              >
                <i
                  className={`fa ${isMinimized ? "fa-window-maximize" : "fa-minus"}`}
                  aria-hidden="true"
                ></i>
              </button>
              <button
                className="bigmall-ai-control-btn"
                onClick={handleClose}
                title="Close"
                aria-label="Close Chat"
              >
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
            </div>
          </div>

          {/* Body and Inputs (only if not minimized) */}
          {!isMinimized && (
            <>
              {/* Message Thread */}
              <div className="bigmall-ai-body">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bigmall-ai-msg ${
                      msg.sender === "user"
                        ? "bigmall-ai-msg-user"
                        : "bigmall-ai-msg-assistant"
                    }`}
                  >
                    {msg.isError ? (
                      <div className="bigmall-ai-error-box">
                        <i
                          className="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        <span>{msg.text}</span>
                      </div>
                    ) : (
                      <p className="bigmall-ai-msg-text">{msg.text}</p>
                    )}

                    {/* Safe Authenticated Order Card */}
                    {msg.orderData && (
                      <div className="bigmall-ai-order-card">
                        <div className="bigmall-ai-order-header">
                          <div className="bigmall-ai-order-id-group">
                            <i
                              className="fa fa-shopping-bag bigmall-ai-order-icon"
                              aria-hidden="true"
                            ></i>
                            <span
                              className="bigmall-ai-order-id"
                              title={`Order #${msg.orderData.orderId}`}
                            >
                              Order #{msg.orderData.orderId}
                            </span>
                          </div>
                          <span
                            className={`bigmall-ai-order-status-badge ${getStatusBadgeClass(
                              msg.orderData.status
                            )}`}
                          >
                            {msg.orderData.status || "Confirmed"}
                          </span>
                        </div>

                        <div className="bigmall-ai-order-details">
                          {msg.orderData.product_pic ? (
                            <img
                              src={resolveImageUrl(msg.orderData.product_pic)}
                              alt={msg.orderData.subcategory_name || "Order Item"}
                              className="bigmall-ai-order-thumb"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="bigmall-ai-order-thumb-fallback">
                              <i className="fa fa-cube" aria-hidden="true"></i>
                            </div>
                          )}

                          <div className="bigmall-ai-order-info">
                            <span className="bigmall-ai-order-item-name">
                              {msg.orderData.subcategory_name}
                            </span>
                            <div className="bigmall-ai-order-item-meta">
                              {msg.orderData.quantity && (
                                <span>Qty: {msg.orderData.quantity}</span>
                              )}
                              {msg.orderData.product_quantity && (
                                <span>({msg.orderData.product_quantity})</span>
                              )}
                              {msg.orderData.total_price !== undefined && (
                                <span className="bigmall-ai-order-price">
                                  • ₹{msg.orderData.total_price}
                                </span>
                              )}
                            </div>
                            {msg.orderData.added_date && (
                              <span className="bigmall-ai-order-date">
                                <i
                                  className="fa fa-calendar-o"
                                  aria-hidden="true"
                                ></i>{" "}
                                Ordered: {msg.orderData.added_date}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Milestone Progress Bar for Non-Cancelled Orders */}
                        {msg.orderData.status !== "Cancelled" &&
                          typeof msg.orderData.statusStep === "number" && (
                            <div className="bigmall-ai-order-progress-box">
                              <div className="bigmall-ai-order-progress-labels">
                                <span className="bigmall-ai-order-step-text">
                                  Step {msg.orderData.statusStep} of 5:{" "}
                                  {ORDER_STATUS_LABELS[
                                    msg.orderData.statusStep
                                  ] || msg.orderData.status}
                                </span>
                                <span className="bigmall-ai-order-step-percent">
                                  {Math.round(
                                    (Math.max(
                                      0,
                                      Math.min(5, msg.orderData.statusStep)
                                    ) /
                                      5) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="bigmall-ai-order-progress-track">
                                <div
                                  className={`bigmall-ai-order-progress-bar ${
                                    msg.orderData.statusStep === 5
                                      ? "bigmall-ai-progress-done"
                                      : ""
                                  }`}
                                  style={{
                                    width: `${
                                      (Math.max(
                                        0,
                                        Math.min(5, msg.orderData.statusStep)
                                      ) /
                                        5) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}

                        {/* Optional Delivery Notes if present */}
                        {msg.orderData.deliveryNotes && (
                          <div className="bigmall-ai-order-notes">
                            <i
                              className="fa fa-info-circle"
                              aria-hidden="true"
                            ></i>
                            <span>{msg.orderData.deliveryNotes}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quick Link to Orders Dashboard */}
                    {(msg.supportType === "order_tracking" ||
                      msg.supportType === "recent_orders") && (
                      <div className="bigmall-ai-action-container">
                        <Link
                          to="/myorder"
                          className="bigmall-ai-action-btn bigmall-ai-action-btn-secondary"
                          onClick={() => setIsOpen(false)}
                        >
                          <i className="fa fa-shopping-bag" aria-hidden="true"></i>
                          View in My Orders
                        </Link>
                      </div>
                    )}

                    {/* Quick Link to Wallet */}
                    {(msg.supportType === "cancellation_policy" ||
                      msg.supportType === "refund_policy") && (
                      <div className="bigmall-ai-action-container">
                        <Link
                          to="/wallet"
                          className="bigmall-ai-action-btn bigmall-ai-action-btn-secondary"
                          onClick={() => setIsOpen(false)}
                        >
                          <i className="fa fa-money" aria-hidden="true"></i>
                          Check Wallet Balance
                        </Link>
                      </div>
                    )}

                    {/* Quick Link to Customer Support Page */}
                    {(msg.supportType === "store_info" ||
                      msg.supportType === "return_policy") && (
                      <div className="bigmall-ai-action-container">
                        <Link
                          to="/customersupport"
                          className="bigmall-ai-action-btn bigmall-ai-action-btn-secondary"
                          onClick={() => setIsOpen(false)}
                        >
                          <i
                            className="fa fa-headphones"
                            aria-hidden="true"
                          ></i>
                          Customer Support Page
                        </Link>
                      </div>
                    )}

                    {/* Grounded Product Cards */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="bigmall-ai-products-grid">
                        {msg.products.map((prod) => (
                          <div
                            key={prod._id || prod.sid || Math.random()}
                            className="bigmall-ai-product-card"
                          >
                            {prod.product_pic ? (
                              <img
                                src={resolveImageUrl(prod.product_pic)}
                                alt={prod.subcategory_name || "Product"}
                                className="bigmall-ai-product-img"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="bigmall-ai-product-img-fallback">
                                <i
                                  className="fa fa-shopping-bag"
                                  aria-hidden="true"
                                ></i>
                              </div>
                            )}

                            <div className="bigmall-ai-product-info">
                              <span
                                className="bigmall-ai-product-name"
                                title={prod.subcategory_name}
                              >
                                {prod.subcategory_name}
                              </span>

                              {prod.product_quantity && (
                                <span className="bigmall-ai-product-qty">
                                  {prod.product_quantity}
                                </span>
                              )}

                              <div className="bigmall-ai-product-price-row">
                                <span className="bigmall-ai-product-selling">
                                  ₹{prod.discount_price ?? prod.price}/-
                                </span>

                                {prod.price !== undefined &&
                                  prod.price !== prod.discount_price && (
                                    <span className="bigmall-ai-product-mrp">
                                      ₹{prod.price}/-
                                    </span>
                                  )}

                                {Boolean(prod.total_discount) && (
                                  <span className="bigmall-ai-product-discount">
                                    {prod.total_discount}% off
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="bigmall-ai-msg-time">{msg.time}</span>
                  </div>
                ))}

                {/* Loading / Typing indicator */}
                {loading && (
                  <div className="bigmall-ai-typing">
                    <span className="bigmall-ai-typing-dot"></span>
                    <span className="bigmall-ai-typing-dot"></span>
                    <span className="bigmall-ai-typing-dot"></span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestions */}
              <div className="bigmall-ai-quick-container">
                {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="bigmall-ai-quick-btn"
                    onClick={() => handleSend(suggestion)}
                    disabled={loading}
                  >
                    <i className="fa fa-bolt" aria-hidden="true"></i>
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="bigmall-ai-input-area">
                <textarea
                  ref={inputRef}
                  className="bigmall-ai-input"
                  placeholder="Ask about orders, wallet, policies, or products..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  maxLength={500}
                  rows={1}
                />
                <button
                  type="button"
                  className="bigmall-ai-send-btn"
                  onClick={() => handleSend()}
                  disabled={loading || !inputMessage.trim()}
                  title="Send message"
                  aria-label="Send message"
                >
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Chatbot;
