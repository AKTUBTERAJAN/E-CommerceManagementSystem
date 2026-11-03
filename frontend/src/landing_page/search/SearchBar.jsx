import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./SearchBar.css";

function SearchBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);

  // Sync input value when URL parameter changes
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }
    const trimmed = query.trim();
    if (!trimmed) {
      return; // Do not submit empty search queries
    }
    navigate(`/product?q=${encodeURIComponent(trimmed)}`);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="bigmall-ai-search-container">
      <form onSubmit={handleSubmit} className="bigmall-ai-search-form" role="search">
        <div className="bigmall-ai-search-wrapper">
          <i className="fa fa-search bigmall-ai-search-icon" aria-hidden="true"></i>

          <input
            type="text"
            className="bigmall-ai-search-input"
            placeholder="Search products with AI..."
            aria-label="Search products with AI"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {query.trim().length > 0 && (
            <button
              type="button"
              className="bigmall-ai-search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search input"
              title="Clear"
            >
              <i className="fa fa-times" aria-hidden="true"></i>
            </button>
          )}

          <button
            type="submit"
            className="bigmall-ai-search-submit-btn"
            aria-label="Submit search"
            title="Search"
          >
            <i className="fa fa-search" aria-hidden="true"></i>
            <span className="bigmall-ai-search-btn-label">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;
