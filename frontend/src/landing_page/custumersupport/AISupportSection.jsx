import React, { useState } from "react";

const FAQ_DATA = [
  {
    id: "faq-1",
    question: "📦 How do I track my Bigmall order?",
    questionHi: "📦 मैं अपना Bigmall ऑर्डर कैसे ट्रैक कर सकता हूँ?",
    answer:
      "You can track your order live from the 'My Orders' section or ask our AI Support Assistant below. Bigmall orders progress through 6 verified milestones: Order Confirmed → Processing → Packed → Shipped → Out For Delivery → Delivered.",
    answerHi:
      "आप 'My Orders' में जाकर या सीधे हमारे AI असिस्टेंट से 'Track my order' पूछकर ऑर्डर ट्रैक कर सकते हैं। बिगमाल में 6 चरणों में लाइव ट्रैकिंग होती है: ऑर्डर कन्फर्म → प्रोसेसिंग → पैक्ड → शिप्ड → आउट फॉर डिलीवरी → डिलीवर्ड।",
  },
  {
    id: "faq-2",
    question: "❌ Can I cancel my order? How does the refund work?",
    questionHi: "❌ क्या मैं अपना ऑर्डर कैंसिल कर सकता हूँ? रिफंड कैसे मिलेगा?",
    answer:
      "Yes! You can cancel any order anytime BEFORE it is marked as 'Delivered'. Upon cancellation, 100% of your payment is instantly credited directly to your Bigmall Wallet. Wallet funds can be used immediately on your next order.",
    answerHi:
      "हाँ! आप डिलीवरी से पहले किसी भी समय अपना ऑर्डर कैंसिल कर सकते हैं। ऑर्डर कैंसिल होते ही 100% राशि तुरंत आपके Bigmall Wallet में जोड़ दी जाती है, जिसका इस्तेमाल आप तुरंत अगली खरीदारी में कर सकते हैं।",
  },
  {
    id: "faq-3",
    question: "🔄 What is the return and replacement policy?",
    questionHi: "🔄 रिटर्न और रिप्लेसमेंट के क्या नियम हैं?",
    answer:
      "To uphold grocery freshness and hygiene, automated online returns are not supported after delivery. If you received damaged, wrong, or spoiled items, please submit a message on this form or call our support team (+91 9653028979) within 24 hours of delivery for replacement or manual refund.",
    answerHi:
      "खाद्य सुरक्षा और स्वच्छता बनाए रखने के लिए डिलीवर किए गए ऑर्डर ऑनलाइन ऑटो-रिटर्न नहीं होते। यदि आपको कोई खराब या गलत सामान मिला है, तो डिलीवरी के 24 घंटों के भीतर सपोर्ट फॉर्म भरें या +91 9653028979 पर कॉल करें।",
  },
  {
    id: "faq-4",
    question: "✏️ Can I modify items or delivery address on a placed order?",
    questionHi: "✏️ क्या ऑर्डर प्लेस होने के बाद उसमें सामान या पता बदल सकते हैं?",
    answer:
      "Placed orders cannot be modified directly. If your order has not been delivered yet, you can cancel it for an instant 100% refund to your Bigmall Wallet and immediately place a fresh order with your updated address or items.",
    answerHi:
      "ऑर्डर कन्फर्म होने के बाद उसमें बदलाव संभव नहीं है। यदि ऑर्डर डिलीवर नहीं हुआ है, तो आप इसे कैंसिल करके तुरंत वॉलेट रिफंड पा सकते हैं और सही पते के साथ नया ऑर्डर प्लेस कर सकते हैं।",
  },
  {
    id: "faq-5",
    question: "💳 How does Bigmall Wallet work?",
    questionHi: "💳 Bigmall वॉलेट कैसे काम करता है?",
    answer:
      "Bigmall Wallet provides instant 1-click checkout with zero payment failure risk. You can add money via UPI or cards, and all refunds from cancelled orders are credited here instantly with zero waiting time.",
    answerHi:
      "Bigmall Wallet से आप 1-क्लिक में सुरक्षित भुगतान कर सकते हैं। आप UPI या कार्ड से पैसे जोड़ सकते हैं, और कैंसिल किए गए सभी ऑर्डर्स का रिफंड बिना किसी देरी के तुरंत वॉलेट में आ जाता है।",
  },
];

function AISupportSection() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeLang, setActiveLang] = useState("en");

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleLaunchChat = () => {
    const launcher = document.querySelector(".bigmall-chat-launcher");
    if (launcher) launcher.click();
  };

  return (
    <div className="container my-5">
      {/* Banner */}
      <div
        className="card shadow-sm border-0 mb-4 p-4 text-white"
        style={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          borderRadius: "16px",
        }}
      >
        <div className="row align-items-center">
          <div className="col-md-8">
            <span
              className="badge bg-warning text-dark mb-2 px-3 py-2 fw-bold"
              style={{ borderRadius: "20px" }}
            >
              <i className="fa fa-sparkles fa-magic me-1"></i> AI Customer Support 24/7
            </span>
            <h3 className="fw-bold mb-2">Instant Answers on Bigmall Services & Orders</h3>
            <p className="text-light opacity-75 mb-0" style={{ fontSize: "15px" }}>
              Have an order question? Ask our AI Customer Support Assistant for instant order tracking, cancellation with immediate wallet refunds, and verified store policies.
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <button
              className="btn btn-warning btn-lg fw-bold px-4 py-2 text-dark shadow"
              style={{ borderRadius: "25px" }}
              onClick={handleLaunchChat}
            >
              <i className="fa fa-comments me-2"></i> Launch AI Support
            </button>
          </div>
        </div>
      </div>

      {/* Verified Policies FAQ Section */}
      <div className="row">
        <div className="col-12 mb-3 d-flex justify-content-between align-items-center">
          <div>
            <h4 className="fw-bold mb-1" style={{ color: "orangered" }}>
              <u>Frequently</u> Asked Questions & Policies
            </h4>
            <small className="text-muted">
              Official policies verified by Bigmall operations
            </small>
          </div>
          <div>
            <button
              className={`btn btn-sm ${activeLang === "en" ? "btn-dark" : "btn-outline-dark"} me-1`}
              onClick={() => setActiveLang("en")}
            >
              English
            </button>
            <button
              className={`btn btn-sm ${activeLang === "hi" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setActiveLang("hi")}
            >
              हिन्दी
            </button>
          </div>
        </div>

        <div className="col-12">
          <div className="accordion" id="supportFaqAccordion">
            {FAQ_DATA.map((faq) => {
              const isOpen = openFaq === faq.id;
              const qText = activeLang === "hi" ? faq.questionHi : faq.question;
              const aText = activeLang === "hi" ? faq.answerHi : faq.answer;

              return (
                <div
                  key={faq.id}
                  className="card mb-2 border shadow-sm"
                  style={{ borderRadius: "10px", overflow: "hidden" }}
                >
                  <div
                    className="card-header bg-white p-3 d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <span className="fw-bold" style={{ fontSize: "15px" }}>
                      {qText}
                    </span>
                    <i
                      className={`fa ${isOpen ? "fa-chevron-up" : "fa-chevron-down"} text-muted`}
                    ></i>
                  </div>
                  {isOpen && (
                    <div className="card-body bg-light text-secondary pt-2 pb-3 px-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                      {aText}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AISupportSection;
