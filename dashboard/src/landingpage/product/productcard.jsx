import React, { useState } from "react";
import { useWatchList } from "../watchlist/watchlistcontext";
import { useCart } from "../mycard/cardconext";


function ProductCard({ product }) {
  const [qty, setQty] = useState(0);
  const [message, setMessage] = useState("");

  const { addToWatchList } = useWatchList();
  const { addToCart } = useCart();

  const increase = () => {
    setQty(qty + 1);
  };

  const decrease = () => {
    if (qty > 0) {
      setQty(qty - 1);
    }
  };

 

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
      fontWeight: "600"
    }}
  >
    <i className="fa fa-check-circle me-2"></i>
    {message}
  </div>
)}
    <div className="col-lg-3 col-md-6 col-sm-12">

      {/* Start Product */}

      <div
        className="card p-3 mt-2"
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,.15)"
        }}
      >

        <img
          src={product.product_pic}
          alt={product.subcategory_name}
          className="card-img-top"
          style={{
            
            objectFit: "contain"
          }}
        />

        <div
          className="card-body border rounded mt-2"
          style={{
            padding: "10px"
          }}
        >

          <b>{product.subcategory_name}</b>

          <br />

          {product.product_quantity}

          <br />

          <i className="fa-solid fa-indian-rupee-sign"></i>

          <s>{product.price}/-</s>

          <b className="ms-2 text-danger">
            {product.discount_price}/-
          </b>

          <div className="input-group mt-2">

            <button
              className="input-group-text"
              onClick={decrease}
            >
              <i class="fa fa-minus" aria-hidden="true"></i>
            </button>

            <input
              type="text"
              value={qty}
              readOnly
              className="form-control text-center fs-5"
            />

            <button
              className="input-group-text"
              onClick={increase}
            >
            <i class="fa fa-plus" aria-hidden="true"></i>
            </button>

          </div>

         <button
  className="btn bg-mycolor text-light mt-2"
  style={{ width: "60px" }}
  onClick={() => {
    if (qty === 0) {
      alert("Please select quantity first");
      return;
    }

    addToCart(product, qty);
     setMessage(" Product Added Successfully");

  setTimeout(() => {
    setMessage("");
  }, 2000);
  }}
>
  Add
</button>
          <button
            className="btn btn-outline-danger w-100 mt-2"
            onClick={() => addToWatchList(product)}
            >
            <i className="fa fa-heart"></i> Add to WatchList
          </button>
        </div>

      </div>

      {/* End Product */}

    </div>
    </>
  );
}

export default ProductCard;