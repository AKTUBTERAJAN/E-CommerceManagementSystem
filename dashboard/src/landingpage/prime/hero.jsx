import React, { useState } from "react";

function Hero() {
  

  return (
    <>
       <div className="container mt-4 mb-5">

      {/* Banner */}
      <div
        className="text-center text-white p-5 rounded"
        style={{
          background: "linear-gradient(90deg,#FF8800,#CC0000)"
        }}
      >
        <h1 className="fw-bold">BigMall Prime</h1>
        <p className="fs-5">
          Enjoy Fast Delivery, Exclusive Deals & Premium Shopping Experience.
        </p>

        <button className="btn btn-light btn-lg mt-2">
          Join Prime
        </button>
      </div>

      {/* Benefits */}

      <div className="row mt-5">

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <i className="fa fa-truck fa-3x text-warning mb-3"></i>
              <h4>Free Fast Delivery</h4>
              <p>
                Get unlimited free delivery on eligible products.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <i className="fa fa-gift fa-3x text-danger mb-3"></i>
              <h4>Exclusive Offers</h4>
              <p>
                Prime members enjoy special discounts and early access deals.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card shadow h-100 text-center">
            <div className="card-body">
              <i className="fa fa-star fa-3x text-primary mb-3"></i>
              <h4>Premium Shopping</h4>
              <p>
                Better shopping experience with exclusive member benefits.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Membership */}

      <div className="card shadow mt-5">

        <div className="card-body text-center">

          <h2 className="text-warning">Membership Plan</h2>

          <h3 className="my-3">₹999 / Year</h3>

          <ul className="list-group list-group-flush text-start">

            <li className="list-group-item">
              ✔ Unlimited Free Delivery
            </li>

            <li className="list-group-item">
              ✔ Prime Exclusive Deals
            </li>

            <li className="list-group-item">
              ✔ Early Access to Sales
            </li>

            <li className="list-group-item">
              ✔ 24×7 Premium Customer Support
            </li>

          </ul>

          <button className="btn btn-warning btn-lg mt-4">
            Become a Prime Member
          </button>

        </div>

      </div>

    </div>
    </>
  );
}

export default Hero;
