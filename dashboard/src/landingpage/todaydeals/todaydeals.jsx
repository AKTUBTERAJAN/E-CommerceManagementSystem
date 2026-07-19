import React, { useState } from "react";
import { useCart } from "../mycard/cardconext";


function TodayDeals({ deals = [] }) {
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState({});

    const { addToCart } = useCart();
  

  const increase = (_id) => {
    setQty({
      ...qty,
      [_id]: (qty[_id] || 0) + 1,
    });
  };

  const decrease = (_id) => {
    if ((qty[_id] || 0) > 0) {
      setQty({
        ...qty,
        [_id]: qty[_id] - 1,
      });
    }
  };

  // const addToCart = (item) => {
  //   alert(
  //     `${item.subcategory_name} Added\nQuantity : ${qty[item.id] || 0}`
  //   );
  // };

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
    <div className="row py-3">

      <div className="fs-3">
        Today <b className="txt-mycolor">Deals</b>
      </div>

      {deals.map((item) => (

        <div
          className="col-lg-2 col-md-3 col-sm-6"
          key={item._id}
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
                  onClick={() => decrease(item._id)}
                >
                  <i class="fa fa-minus" aria-hidden="true"></i>
                </button>

                <input
                  type="text"
                  readOnly
                  value={qty[item._id] || 0}
                  className="form-control text-center"
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

export default TodayDeals;