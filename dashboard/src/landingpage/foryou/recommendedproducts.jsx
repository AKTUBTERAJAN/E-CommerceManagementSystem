import React, { useEffect, useState } from "react";
import ProductCard from "../product/productcard";
import { getAiRecommendations } from "../../api/ai";
import "./recommendedproducts.css";

const normalizeProduct = (item) => {
  if (!item) return item;
  const pic = item.product_pic || "";
  const normalizedPic =
    pic.startsWith("http://") || pic.startsWith("https://") || pic.startsWith("/")
      ? pic
      : `/${pic}`;
  return {
    ...item,
    product_pic: normalizedPic,
  };
};

function RecommendedProducts() {
  const [recommendations, setRecommendations] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAiRecommendations({ type: "foryou", limit: 6 });
        if (!isMounted) return;

        if (data && data.success && Array.isArray(data.recommendations)) {
          setRecommendations(data.recommendations);
          setAiSummary(data.aiSummary || null);
        } else {
          setRecommendations([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("AI recommendations fetch error:", err?.message || err);
        setError("Unable to load recommendations at this time.");
        setRecommendations([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Gracefully hide section if error occurred or empty products returned
  if (!loading && (error || recommendations.length === 0)) {
    return null;
  }

  return (
    <div className="row bigmall-ai-rec-section">
      <div className="col-12 bigmall-ai-rec-header">
        <div className="bigmall-ai-rec-title">
          AI Recommended <b className="txt-mycolor">for You</b>
        </div>
        {aiSummary && (
          <span className="bigmall-ai-rec-badge">
            <i className="fa fa-bolt me-1 text-warning" aria-hidden="true"></i>
            {aiSummary}
          </span>
        )}
      </div>

      {loading ? (
        <div className="bigmall-ai-rec-loading text-center py-4 w-100">
          <div
            className="spinner-border text-warning"
            role="status"
            style={{ width: "2.5rem", height: "2.5rem" }}
          >
            <span className="visually-hidden">Loading recommendations...</span>
          </div>
          <p className="mt-2 text-muted fw-semibold">
            Finding recommendations for you...
          </p>
        </div>
      ) : (
        recommendations.map((item) => (
          <ProductCard key={item._id} product={normalizeProduct(item)} />
        ))
      )}
    </div>
  );
}

export default RecommendedProducts;
