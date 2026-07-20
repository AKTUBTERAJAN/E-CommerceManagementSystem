import React from "react";

function Hero() {
  return (
  <>
    <div className="container mt-5 mb-5">

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-warning">BigMall Business Account</h1>
        <p className="text-muted">
          Grow your business with BigMall and enjoy exclusive business benefits.
        </p>
      </div>

      {/* Benefits */}
      <div className="row">

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <i className="fa fa-briefcase fa-3x text-warning mb-3"></i>
              <h4>Business Orders</h4>
              <p>
                Purchase products in bulk for your business with ease.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <i className="fa fa-money fa-3x text-success mb-3"></i>
              <h4>Special Pricing</h4>
              <p>
                Get exclusive business discounts and wholesale prices.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <i className="fa fa-truck fa-3x text-primary mb-3"></i>
              <h4>Fast Delivery</h4>
              <p>
                Reliable and priority delivery for business customers.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Why Choose */}
      <div className="card shadow mt-5">
        <div className="card-body">
          <h3 className="text-center mb-4">Why Choose BigMall Business?</h3>

          <ul className="list-group list-group-flush">
            <li className="list-group-item">✔ GST Invoice Available</li>
            <li className="list-group-item">✔ Bulk Purchase Facility</li>
            <li className="list-group-item">✔ Dedicated Business Support</li>
            <li className="list-group-item">✔ Secure Online Payments</li>
            <li className="list-group-item">✔ Business Exclusive Offers</li>
          </ul>
        </div>
      </div>

      {/* Button */}
      <div className="text-center mt-5">
        <button className="btn btn-warning btn-lg">
          Register Business Account
        </button>
      </div>

    </div>
  </>
  );
}

export default Hero;