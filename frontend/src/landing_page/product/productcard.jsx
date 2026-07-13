import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const [qty, setQty] = useState(0);
  const navigate = useNavigate();

  const increase = () => {
    setQty(qty + 1);
  };

  const decrease = () => {
    if (qty > 0) {
      setQty(qty - 1);
    }
  };

  const addToCart = () => {
  // Check user login
  const user = localStorage.getItem("user");

  if (!user) {
    alert("Please Login First");
    navigate("/signin");   // Apna login route yahan likho
    return;
  }

  if (qty === 0) {
    alert("Please select quantity");
    return;
  }

  alert(`${product.subcategory_name} Added to Cart\nQuantity : ${qty}`);

  // Future MERN Backend
  // axios.post("http://localhost:5000/api/cart",{
  //   ...product,
  //   quantity: qty
  // })
};

  return (
    <>
    
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
            style={{
              width: "60px"
            }}
            onClick={addToCart}
          >
            Add
          </button>

        </div>

      </div>

      {/* End Product */}

    </div>
    </>
  );
}

export default ProductCard;