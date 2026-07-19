import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function TodayDeals({ deals = [] }) {
  const [qty, setQty] = useState({});
  const navigate = useNavigate();
  

  const increase = (id) => {
    setQty({
      ...qty,
      [id]: (qty[id] || 0) + 1,
    });
  };

  const decrease = (id) => {
    if ((qty[id] || 0) > 0) {
      setQty({
        ...qty,
        [id]: qty[id] - 1,
      });
    }
  };

 
  const addToCart = (product) => {
  // Check user login
   const user = localStorage.removeItem("user");
  console.log("User =", user);

  if (!user || user === "null" || user === "undefined") {
    alert("Please Login First");
    navigate("/signin");
    return;
  
};
 
};


  return (
    <div className="row py-3">

      <div className="fs-3">
        Today <b className="txt-mycolor">Deals</b>
      </div>

      {deals.map((item) => (

        <div
          className="col-lg-2 col-md-3 col-sm-6"
          key={item._id || item.id}
        >

          <div className="card p-3 mt-2">

            <span
              className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
            >
              {item.total_discount} %
            </span>

            <img
              src={item.product_pic}
              alt={item.subcategory_name}
              className="card-img-top"
             
            />

            <div className="card-body border rounded">

              <b>{item.subcategory_name}</b>

              <br />

              {item.product_quantity}

              <br />

              <i class="fa fa-inr" aria-hidden="true"></i>

              <s>{item.price}/-</s>

              <b className="ms-2">
                <i class="fa fa-inr" aria-hidden="true"></i>
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
                  readOnly
                  value={qty[item._id || item.id] || 0}
                  className="form-control text-center"
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
                style={{ width: "70px" }}
                onClick={() => addToCart(item)}
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

export default TodayDeals;
