import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductSidebar from "./productsidebar";
import ProductCard from "./productcard";
import { getProducts, getSubcategories } from "../../api/products";
import { searchAiProducts } from "../../api/ai";
import "./search.css";

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

function Hero() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [subcat, setSubcat] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [searchParams] = useSearchParams();
  const rawQ = searchParams.get("q");
  const q = rawQ ? rawQ.trim() : "";
  const sid = searchParams.get("sid");

  // Load subcategories for sidebar navigation
  useEffect(() => {
    let isMounted = true;
    getSubcategories()
      .then((data) => {
        if (isMounted) setSubcat(data || []);
      })
      .catch((err) => console.error("Subcategories load error:", err));

    return () => {
      isMounted = false;
    };
  }, []);

  // When not searching, load default catalog products if not already loaded
  useEffect(() => {
    if (!q) {
      if (products.length === 0) {
        getProducts()
          .then((data) => {
            setProducts(data || []);
          })
          .catch((err) => console.error("Products load error:", err));
      }
    }
  }, [q, products.length]);

  // Execute AI search when query `q` is present; reset when absent
  useEffect(() => {
    if (!q) {
      setSearchResults([]);
      setAiSummary(null);
      setSearchLoading(false);
      setSearchError(null);
      return;
    }

    let isMounted = true;
    setSearchLoading(true);
    setSearchError(null);
    setSearchResults([]);
    setAiSummary(null);

    searchAiProducts(q)
      .then((data) => {
        if (!isMounted) return;
        if (data && data.success) {
          setSearchResults(Array.isArray(data.products) ? data.products : []);
          setAiSummary(data.aiSummary || null);
        } else {
          setSearchError(data?.error || "Unable to complete search.");
          setSearchResults([]);
          setAiSummary(null);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const errorMsg =
          err?.message ||
          "An error occurred while fetching search results.";
        setSearchError(errorMsg);
        setSearchResults([]);
        setAiSummary(null);
      })
      .finally(() => {
        if (isMounted) {
          setSearchLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [q]);

  const handleRetry = () => {
    if (!q) return;
    setSearchLoading(true);
    setSearchError(null);
    searchAiProducts(q)
      .then((data) => {
        if (data && data.success) {
          setSearchResults(Array.isArray(data.products) ? data.products : []);
          setAiSummary(data.aiSummary || null);
        } else {
          setSearchError(data?.error || "Unable to complete search.");
        }
      })
      .catch((err) => {
        setSearchError(err?.message || "An error occurred while fetching search results.");
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  const handleClearSearch = () => {
    navigate("/product");
  };

  const isSearching = Boolean(q);

  const filteredProducts = sid
    ? products.filter((p) => Number(p.sid) === Number(sid))
    : products;

  return (
    <>
      <div className="row p-4">
        <div className="col-sm-2">
          <ProductSidebar subcat={subcat} />
        </div>

        <div className="col-sm-10">
          {isSearching ? (
            <div>
              {/* AI Search Header & Summary */}
              <div className="bigmall-ai-search-results-header">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <h4 className="mb-0 text-dark fw-bold">
                    <i className="fa fa-search me-2 text-warning" aria-hidden="true"></i>
                    Search Results for <span className="txt-mycolor">"{q}"</span>
                  </h4>
                  <div className="d-flex align-items-center gap-2">
                    {!searchLoading && !searchError && (
                      <span className="bigmall-ai-search-count-badge">
                        {searchResults.length} {searchResults.length === 1 ? "product" : "products"} found
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={handleClearSearch}
                      title="Clear search filter"
                    >
                      <i className="fa fa-times me-1"></i>Clear Search
                    </button>
                  </div>
                </div>

                {aiSummary && (
                  <div className="bigmall-ai-search-summary-alert mt-3">
                    <i className="fa fa-info-circle me-2 text-warning fs-5" aria-hidden="true"></i>
                    <span>{aiSummary}</span>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {searchLoading && (
                <div className="bigmall-ai-search-status-box text-center py-5">
                  <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Searching with AI...</span>
                  </div>
                  <p className="mt-3 text-muted fw-semibold fs-5">Searching BigMall products with AI...</p>
                </div>
              )}

              {/* Error State */}
              {!searchLoading && searchError && (
                <div className="bigmall-ai-search-status-box text-center py-5">
                  <i className="fa fa-exclamation-triangle fa-3x text-danger mb-3" aria-hidden="true"></i>
                  <h4 className="text-danger fw-bold">Unable to Complete Search</h4>
                  <p className="text-muted mb-3">{searchError}</p>
                  <button className="btn btn-warning" onClick={handleRetry}>
                    <i className="fa fa-refresh me-2"></i>Retry Search
                  </button>
                </div>
              )}

              {/* No Results State */}
              {!searchLoading && !searchError && searchResults.length === 0 && (
                <div className="bigmall-ai-search-status-box text-center py-5">
                  <i className="fa fa-search fa-3x text-muted mb-3" aria-hidden="true"></i>
                  <h4 className="text-secondary fw-bold">No Products Found</h4>
                  <p className="text-muted mb-3">
                    {aiSummary || `No matching products found in BigMall inventory for "${q}".`}
                  </p>
                  <button className="btn btn-outline-warning" onClick={handleClearSearch}>
                    View All Products
                  </button>
                </div>
              )}

              {/* Search Results Grid */}
              {!searchLoading && !searchError && searchResults.length > 0 && (
                <div className="row">
                  {searchResults.map((item) => (
                    <ProductCard
                      key={item._id}
                      product={normalizeProduct(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Regular Category / Product View */
            <div className="row">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <ProductCard
                    key={item._id}
                    product={normalizeProduct(item)}
                  />
                ))
              ) : (
                <h4 className="text-center mt-5">No Products Found</h4>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Hero;
