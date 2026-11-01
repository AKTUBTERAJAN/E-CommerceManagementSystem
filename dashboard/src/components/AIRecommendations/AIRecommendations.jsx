import React, { useEffect, useState } from "react";
import ProductCard from "../../landingpage/product/productcard";
import { getRecommendations, getProducts } from "../../api/products";
import "./AIRecommendations.css";

function AIRecommendations({ limit = 4, productId = null, sid = null, title = null }) {
  const [products, setProducts] = useState([]);
  const [reason, setReason] = useState("");
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const params = { limit };
        if (productId) params.productId = productId;
        if (sid) params.sid = sid;

        const response = await getRecommendations(params);

        if (isMounted && response) {
          const recProducts = Array.isArray(response)
            ? response
            : response.products || [];

          setProducts(recProducts);
          setReason(response.reason || "");
          setIsPersonalized(Boolean(response.personalized));
        }
      } catch (err) {
        console.warn("Dashboard AI recommendations endpoint unavailable, falling back to product list:", err.message);
        try {
          const fallbackRes = await getProducts({ limit });
          if (isMounted && fallbackRes) {
            const list = Array.isArray(fallbackRes) ? fallbackRes : fallbackRes.products || [];
            setProducts(list.slice(0, limit));
            setReason("Popular grocery essentials");
          }
        } catch {
          // ignore
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecommendations();

    return () => {
      isMounted = false;
    };
  }, [limit, productId, sid]);

  if (loading) {
    return (
      <div className="row py-3">
        <div className="col-12 text-center py-4">
          <div className="spinner-border text-danger spinner-border-sm me-2" role="status"></div>
          <span className="text-muted fs-6">Loading personalized recommendations...</span>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="bigmall-recommendations-section">
      <div className="bigmall-rec-header">
        <div className="bigmall-rec-title-wrap">
          <div className="fs-3">
            {title ? (
              title
            ) : (
              <>
                Recommended <b className="txt-mycolor">For You</b>
              </>
            )}
          </div>
          <span className="bigmall-ai-badge">
            <i className="fa fa-magic" aria-hidden="true"></i>
            {isPersonalized ? "Personalized AI Picks" : "AI Trending Deals"}
          </span>
        </div>
        {reason && <div className="bigmall-rec-reason">{reason}</div>}
      </div>

      <div className="row">
        {products.map((item) => (
          <ProductCard key={item._id || item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

export default AIRecommendations;
