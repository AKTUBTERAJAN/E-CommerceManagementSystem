import React, { useState, useEffect } from "react";
import { useCart } from "../mycard/cardconext";
import { getCurrentUser } from "../../api/user";

function TodayDeals({ deals = [] }) {
  const [userName, setUserName] = useState("Guest");
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState({});

  const { addToCart } = useCart();
    useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();

      // apiRequest agar direct object return kare
      if (res.name) {
        setUserName(res.name);
      }
      // Agar response user: ho
      else if (res.user?.name) {
        setUserName(res.user.name);
      }
      // Agar axios response ho
      else if (res.data?.name) {
        setUserName(res.data.name);
      }
    } catch (err) {
      console.log("User Load Error:", err);
    }
  };

  fetchUser();
}, []);
  

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
    <div className="mb-4">
      <h2 className="fw-bold">
        Hi <span className="txt-mycolor">{userName}</span> 👋
      </h2>
      <p
        className="text-secondary"
        style={{
          fontSize: "17px",
          marginTop: "-5px"
        }}
      >
         Here are today's best deals selected especially for you.
      </p>
    </div>
    {deals.map((item) => (
    <div className="col-lg-2 col-md-3 col-sm-6"key={item.id}>
      <div className="card  mt-2">
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
                  onClick={() => decrease(item.id)}
                >
                  <i class="fa fa-minus" aria-hidden="true"></i>
                </button>

                <input
                  type="text"
                  readOnly
                  value={qty[item.id] || 0}
                  className="form-control text-center"
                />

                <button
                  className="input-group-text"
                  onClick={() => increase(item.id)}
                >
                 <i class="fa fa-plus" aria-hidden="true"></i>
                </button>

              </div>

              
               <button
                  className="btn bg-mycolor text-light mt-2"
                  style={{ width: "60px" }}
                  onClick={() => {

                    const quantity = qty[item.id] || 0;

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