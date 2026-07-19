import React, { useState } from "react";
import { useWatchList } from "./watchlistcontext";
import { useCart } from "../mycard/cardconext";

function Watchlist() {
  const [message, setMessage] = useState("");

  const { watchList, removeWatchList } = useWatchList();
  const { addToCart } = useCart();

  return (
    <>
      {message && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: "9999",
            background: "#28a745",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            width: "300px",
            fontWeight: "600",
          }}
        >
          <i className="fa fa-check-circle me-2"></i>
          {message}
        </div>
      )}

      <div className="container mt-4">
        <h1 className="fw-bold">
          My{" "}
          <span className="txt-mycolor">
            <u>Watchlist</u>
            <i className="fa fa-th-list p-2" aria-hidden="true"></i>
          </span>
        </h1>

        {watchList.length === 0 ? (
          <h5>No Product Added</h5>
        ) : (
          <div className="row">
            {watchList.map((item) => (
              <div className="col-md-3 mb-3" key={item.watchlistId}>
                <div className="card p-2">
                  <img
                    src={item.product_pic}
                    alt={item.subcategory_name}
                    className="card-img-top"
                    style={{
                      height: "250px",
                      objectFit: "contain",
                    }}
                  />

                  <div className="card-body border rounded mt-2">
                    <b>{item.subcategory_name}</b>

                    <p>₹ {item.discount_price}</p>

                    <button
                      className="btn btn-success w-100 mb-2"
                      onClick={() => {
                        addToCart(item, 1);

                        setMessage("Product Added Successfully");

                        setTimeout(() => {
                          setMessage("");
                        }, 1000);

                        removeWatchList(item.watchlistId);
                      }}
                    >
                      <i className="fa fa-shopping-cart me-2"></i>
                      Add To Cart
                    </button>

                    <button
                      className="btn btn-danger w-100"
                      onClick={() =>
                        removeWatchList(item.watchlistId)
                      }
                    >
                      <i className="fa fa-trash me-2"></i>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Watchlist;