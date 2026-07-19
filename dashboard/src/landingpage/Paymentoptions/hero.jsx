import React, { useState } from "react";

function Hero() {
  const [paymentMethod, setPaymentMethod] = useState("");

  const handlePayment = () => {
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    alert("You selected: " + paymentMethod);
  };

  return (
    <div className="container mt-2 mb-4">
        <h1 className="text-center">
      Payment<b><span className="txt-mycolor "><u>Options</u><i class="fa fa-credit-card p-2" aria-hidden="true"></i></span></b> 
</h1>
      <div className="card shadow p-4">
        <h2 className="text-center text-warning mb-4">
          Select Payment Method
        </h2>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="radio"
            name="payment"
            value="UPI"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label className="form-check-label">
            UPI
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="radio"
            name="payment"
            value="Debit Card"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label className="form-check-label">
            Debit Card
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="radio"
            name="payment"
            value="Credit Card"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label className="form-check-label">
            Credit Card
          </label>
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="radio"
            name="payment"
            value="Net Banking"
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label className="form-check-label">
            Net Banking
          </label>
        </div>

        
      </div>
    </div>
  );
}

export default Hero;