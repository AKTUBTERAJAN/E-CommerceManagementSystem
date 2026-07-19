import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LatestProducts({ pdata = [] }) {
  const [qty, setQty] = useState({});
  const navigate = useNavigate();
  

  const increase = (id) => {
    setQty((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decrease = (id) => {
    if ((qty[id] || 0) > 0) {
      setQty((prev) => ({
        ...prev,
        [id]: prev[id] - 1,
      }));
    }
  };

const addToCart = (product) => {

  const user = localStorage.removeItem("user");
  console.log("User =", user);

  if (!user || user === "null" || user === "undefined") {
    alert("Please Login First");
    navigate("/signin");
    return;
  }

  
};
  return (
    <div className="row product fs-4 p-3">

      <div className="fs-3 mb-3">
        Latest <b className="txt-mycolor">Product</b>
      </div>

      {pdata.map((item) => (
        <div
          className="col-lg-2 col-md-3 col-sm-6 mb-3"
          key={item._id || item.id}
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
                  onClick={() => decrease(item._id || item.id)}
                >
                   <i class="fa fa-minus" aria-hidden="true"></i>
                </button>

                <input
                  type="text"
                  className="form-control text-center fs-5"
                  value={qty[item._id || item.id] || 0}
                  readOnly
                />

                <button
                  className="input-group-text"
                  onClick={() => increase(item._id || item.id)}
                >
                 <i className="fa fa-plus" aria-hidden="true"></i>
                </button>

              </div>

              <button
                className="btn bg-mycolor text-light mt-2"
                style={{ width: "60px" }}
                onClick={() => {addToCart(item)}}
              >
                Add
              </button>

            </div>
          </div>
        </div>
      ))}

    </div>
  );
}

export default LatestProducts;
