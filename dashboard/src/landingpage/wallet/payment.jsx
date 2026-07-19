import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./walletcontext";

function Payment() {

  const navigate = useNavigate();

  const {
    paymentAmount,
    addMoney,
  } = useWallet();

  const [method, setMethod] = useState("UPI");

  const handlePayment = () => {

    addMoney();

    alert("Payment Successful");

    navigate("/wallet");

  };

  return (
    <>
      <div className="text-center fs-2">
        Secure{" "}
        <b className="txt-mycolor">
          <u>Payment</u>
          <i className="fa fa-credit-card ms-2"></i>
        </b>
      </div>

      <h6 className="text-center">
        Complete your payment securely
      </h6>

      <div className="row mt-4">

        <div className="col-sm-6 mx-auto">

          <div
            className="card p-4"
            style={{
              background:
                "linear-gradient(60deg,#ffea00e6,#cc0041,#77cc00)",
              color: "white",
              borderRadius: "10px",
            }}
          >

            <h4 className="text-center">
              Amount To Pay
            </h4>

            <h2 className="text-center">
              ₹ {paymentAmount}
            </h2>

            <hr />

            <h5>Select Payment Method</h5>

            <div className="form-check mt-3">
              <input
                className="form-check-input"
                type="radio"
                checked={method === "UPI"}
                onChange={() => setMethod("UPI")}
              />
              <label className="form-check-label">
                UPI
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                checked={method === "Debit Card"}
                onChange={() => setMethod("Debit Card")}
              />
              <label className="form-check-label">
                Debit Card
              </label>
            </div>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                checked={method === "Credit Card"}
                onChange={() => setMethod("Credit Card")}
              />
              <label className="form-check-label">
                Credit Card
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                checked={method === "Net Banking"}
                onChange={() => setMethod("Net Banking")}
              />
              <label className="form-check-label">
                Net Banking
              </label>
            </div>

            <button
              className="btn btn-dark"
              onClick={handlePayment}
            >
              <i className="fa fa-lock me-2"></i>

              Pay ₹{paymentAmount}
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default Payment;