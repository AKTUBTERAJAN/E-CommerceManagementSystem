import React, { useState } from "react";
import { useCart } from "../mycard/cardconext";


function LatestProducts({ pdata = [] }) {
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState({});
  const { addToCart } = useCart();
  

  const increase = (_id) => {
    setQty((prev) => ({
      ...prev,
      [_id]: (prev[_id] || 0) + 1,
    }));
  };

  const decrease = (_id) => {
    if ((qty[_id] || 0) > 0) {
      setQty((prev) => ({
        ...prev,
        [_id]: prev[_id] - 1,
      }));
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
 
<div className="row product fs-4 p-3">

      <div className="fs-3 mb-3">
        Latest <b className="txt-mycolor">Product</b>
      </div>

      {pdata.map((item) => (
        <div
          className="col-lg-2 col-md-3 col-sm-6 mb-3"
          key={item._id}
        >
          <div
            className="card p-3 mt-2"
            style={{
              borderRadius: "12px",
            }}
          >
            <img
              src={item.product_pic}
              alt={item.subcategory_name}
              className="card-img-top"
              style={{
               
                objectFit: "contain",
              }}
            />

            <div
              className="card-body border rounded mt-2"
              style={{ padding: "5px" }}
            >
              <b>{item.subcategory_name}</b>

              <br />

              {item.product_quantity}

              <br />

              <i className="fa-solid fa-indian-rupee-sign"></i>

              <s>{item.price}/-</s>

              <b className="ms-2">
                {item.discount_price}/-
              </b>

              <div className="input-group mt-2">

                <button
                  className="input-group-text"
                  onClick={() => decrease(item._id)}
                >
                   <i class="fa fa-minus" aria-hidden="true"></i>
                </button>

                <input
                  type="text"
                  className="form-control text-center fs-5"
                  value={qty[item._id] || 0}
                  readOnly
                />

                <button
                  className="input-group-text"
                  onClick={() => increase(item._id)}
                >
                 <i class="fa fa-plus" aria-hidden="true"></i>
                </button>

              </div>

              <button
                className="btn bg-mycolor text-light mt-2"
                style={{ width: "60px" }}
                onClick={() => {

                  const quantity = qty[item._id] || 0;

                  if (quantity === 0) {
                    alert("Please select quantity first");
                    return;
                  }

                  addToCart(item, quantity);

                  setMessage("Product Added Successfully");

                  setTimeout(() => {
                    setMessage("");
                  }, 1000);

                    }}
                  >
                    Add
              </button>

            </div>
          </div>
        </div>
      ))}

    </div>
  </>
  );
}

export default LatestProducts;