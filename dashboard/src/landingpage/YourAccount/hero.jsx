import React from "react";
import { Link } from "react-router-dom";


function Hero() {
  const accountItems = [
    {
      id: 1,
      title: "Your Orders",
      desc: "Track, return, or buy things again",
      icon: "fa fa-shopping-bag",
      path: "/myorder",
    },
    {
      id: 2,
      title: "Login & Security",
      desc: "Edit login, name and mobile number",
      icon: "fa fa-lock",
      path: "/myprofile",
    },
    {
      id: 3,
      title: "BigMall Prime",
      desc: "View benefits and payment settings",
      icon: "fa fa-star",
      path: "/prime",
    },
    {
      id: 4,
      title: "Your Addresses",
      desc: "Edit addresses for orders and gifts",
      icon: "fa fa-map-marker",
      path: "/youraddress",
    },
    {
      id: 5,
      title: "Business Account",
      desc: "Save more with GST invoice and bulk orders",
      icon: "fa fa-building",
      path: "/business",
    },
    {
      id: 6,
      title: "Payment Options",
      desc: "Edit or add payment methods",
      icon: "fa fa-credit-card",
      path: "/paymentoptions",
    },
    {
      id: 7,
      title: "BigMall Wallet",
      desc: "Add money to your wallet balance",
      icon: "fa fa-money",
      path: "/wallet",
    },
    {
      id: 8,
      title: "Contact Us",
      desc: "Contact customer service via phone or chat",
      icon: "fa fa-envelope",
      path: "/customersupport",
    },
  ];

  return (
    <div className="container py-4">
      <h1 className="fw-bold mb-4">
        Your <span className="txt-mycolor"><u>Account</u><i class="fa fa-university p-2" aria-hidden="true"></i></span>
      </h1>

      <div className="row">
        {accountItems.map((item) => (
          <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
            <Link
              to={item.path}
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="account-card">
                <div className="icon-box">
                  <i className={item.icon}></i>
                </div>

                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hero;