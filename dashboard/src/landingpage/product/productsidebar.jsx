import React from "react";
import { Link } from "react-router-dom";

function ProductSidebar({ subcat = [] }) {
  return (
    <div>
      <ul className="list-group">
        <li className="list-group-item bg-mycolor text-light">
          Sub Category
        </li>

        {subcat.map((item) => (
          <Link
            key={item.id}
            to={`/product?sid=${item.id}`}
            className="text-decoration-none"
          >
            <li
              className="list-group-item"
              style={{
                cursor: "pointer",
                color: "#000",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#fdb90d";
                e.target.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#fff";
                e.target.style.color = "#000";
              }}
            >
              {item.subcategory_name}
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ProductSidebar;