import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ProductSidebar from "./productsidebar";
import ProductCard from "./productcard";
import { getProducts, getSubcategories } from "../../api/products";

function Hero() {
  const [products, setProducts] = useState([]);
  const [subcat, setSubcat] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const sid = searchParams.get("sid");
  const searchQuery = searchParams.get("search") || searchParams.get("q") || "";

  useEffect(() => {
    loadData();
  }, [sid, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = {};
      if (sid) params.sid = sid;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const [productData, subcatData] = await Promise.all([
        getProducts(params),
        getSubcategories(),
      ]);

      setProducts(Array.isArray(productData) ? productData : []);
      setSubcat(Array.isArray(subcatData) ? subcatData : []);
    } catch (err) {
      console.error("Dashboard Product load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    const updated = new URLSearchParams(searchParams);
    updated.delete("search");
    updated.delete("q");
    setSearchParams(updated);
  };

  return (
    <>
      <div className="row p-4">
        <div className="col-sm-2">
          <ProductSidebar subcat={subcat} />
        </div>

        <div className="col-sm-10">
          <div className="row">
            {/* AI Search Query Feedback Banner */}
            {searchQuery && (
              <div className="col-12 mb-3">
                <div
                  className="d-flex align-items-center justify-content-between p-2 px-3 rounded"
                  style={{
                    background: "linear-gradient(135deg, #fff8f0 0%, #fff2f2 100%)",
                    border: "1px solid #ffcc80",
                  }}
                >
                  <div>
                    <i className="fa fa-magic text-warning me-2"></i>
                    <span>
                      AI Smart Search: <strong>"{searchQuery}"</strong>
                      <span className="badge bg-danger ms-2">{products.length} found</span>
                    </span>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={clearSearch}
                    title="Clear Search Filter"
                  >
                    <i className="fa fa-times me-1"></i> Clear
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="col-12 text-center py-5">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Searching Bigmall products...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((item) => (
                <ProductCard
                  key={item._id}
                  product={item}
                />
              ))
            ) : (
              <h4 className="text-center mt-5">No Products Found</h4>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
