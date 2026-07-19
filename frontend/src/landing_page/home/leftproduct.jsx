import React from "react";

import masala from "../../assets/masala1.png";
import apple from "../../assets/Apple2.jpg";
import pineapple from "../../assets/pineapple1.jpg";
import chips from "../../assets/chips1.jpg";
import horlicks from "../../assets/horlicks1.png";
import ganesh from "../../assets/Ganesh.png";

function LeftProducts() {
  const products = [
    {
      id: 1,
      name: "Masala",
      image: masala,
      qty: "1 Kg",
      oldPrice: "1200",
      newPrice: "960",
    },
    {
      id: 2,
      name: "Apple",
      image: apple,
      qty: "1 Kg",
      oldPrice: "100",
      newPrice: "70",
    },
    {
      id: 3,
      name: "Pineapple",
      image: pineapple,
      qty: "2 Pc",
      oldPrice: "200",
      newPrice: "180",
    },
    {
      id: 4,
      name: "Chips",
      image: chips,
      qty: "12 Packs",
      oldPrice: "60",
      newPrice: "48",
    },
    {
      id: 5,
      name: "Horlicks",
      image: horlicks,
      qty: "1 Kg",
      oldPrice: "250",
      newPrice: "200",
    },
  ];

  return (
    <div className="col-sm-5">
    <div className="marquee  ">

      {/* Marquee */}
      <div className="marquee-content ">
        {products.map((item) => (
          <div className="card mb-3" key={item.id}>
            <div className="row g-0">

              <div className="col-md-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-fluid rounded-start"
                />
              </div>

              <div className="col-md-8">
                <div className="card-body">

                  <h5 className="card-title">{item.name}</h5>

                  <p className="card-text">
                     <i className="fa fa-inr" aria-hidden="true"></i>{" "}
                    {item.qty} ||{" "}
                    <s>{item.oldPrice}/-</s>{" "}
                    <b>{item.newPrice}/-</b>

                    <br />
                    <br />

                    <button className="btn btn-outline-success">
                      Cart{" "}
                     <i className="fa fa-shopping-cart " aria-hidden="true"></i>
                    </button>
                  </p>

                  <p className="card-text">
                    <small className="text-body-secondary">
                      Last updated 3 mins ago
                    </small>
                  </p>

                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
     {/* Bottom Image */}
      <a href="/product">
        <img
          src={ganesh}
          alt="Ganesh"
          className="d-block w-100"
          style={{ height: "250px" }}
        />
      </a>
    </div>
  );
}

export default LeftProducts;