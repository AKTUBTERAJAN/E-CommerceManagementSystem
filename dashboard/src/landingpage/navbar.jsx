import React, { useEffect, useState } from "react";
import {Link, NavLink } from "react-router-dom";
import { useCart } from "./mycard/cardconext";
import { getFileUrl } from "../api/api";
import { getCurrentUser } from "../api/user";
import { useNavigate } from "react-router-dom";


function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
   const [sticky, setSticky] = useState(false);
   const { cart } = useCart();
  const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  alert("Sign Out Successfully");

  window.location.href = "bigmall-frontend-sage.vercel.app/";
};
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to load user", error);
      }
    };

    if (localStorage.getItem("token")) {
      loadUser();
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
   
      {/* Top Header */}
      <div
        className="row t1  text-center bg-mycolor text-light py-1"
        style={{
          
          fontSize: "15px",
        }}
      >
        <div className="container navbar-fixed">
          <div className="row t1  text-center bg-mycolor text-light py-1">

            <div className="col-lg-3 col-md-6 col-sm-12 ">
              <i className="fa fa-envelope me-1" aria-hidden="true"></i>
              <a
                href="mailto:rajankushwaha819@gmail.com"
                className="text-white text-decoration-none"
              >
                rajankushwaha819@gmail.com
              </a>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12">
              <i className="fa fa-phone-square me-1" aria-hidden="true"></i>
              <a
                href="tel:+919653028979"
                className="text-white text-decoration-none"
              >
                +91 9653028979
              </a>
            </div>

            <div className="col-lg-4 col-md-8 col-sm-12">
             <i className="fa fa-certificate me-1" aria-hidden="true"></i>
              An ISO Certified E-Commerce Company
            </div>

            <div className="col-lg-2 col-md-4 col-12">
              <a href="https://www.instagram.com/uphub369/" className="text-white me-2">
                <i className="fa fa-instagram" aria-hidden="true"></i>
              </a>

              <a href="https://www.facebook.com/rajan.kushwaha.5836/" className="text-white me-2">
                <i className="fa fa-facebook-square" aria-hidden="true"></i>
              </a>

              <a href="https://web.whatsapp.com/" className="text-white me-2">
                <i className="fa fa-whatsapp" aria-hidden="true"></i>
              </a>

              <a href="https://www.youtube.com/@UPHUB369" className="text-white me-2">
                <i className="fa fa-youtube-play" aria-hidden="true"></i>
              </a>

              <a href="https://x.com/RAJANKU63374902" className="text-white">
                <i className="fa fa-twitter" aria-hidden="true"></i>
              </a>
            </div>

          </div>
        </div>
      </div>
 <div className={`${
    sticky ? "fixed-nav" : ""
    }`}>
      {/* Middle Header */}
    <div
     style={{
    background: sticky
      ? "linear-gradient(to right,#ffd400,#ff7b00,#d50000,#7f6000,#73b300)"
      : "#ffffff",
    transition: "0.4s ease"
  }}>
      <div className=" py-1.2">
        <div className="row ">
          <div className="col-1"></div>
          <div className="col-lg-5 text-center text-md-start mb-3 mb-md-0 ">
            <img src="media/BigMall.png" style={{height:"60px"}}/>
          </div>

          <div className="col-lg-4 d-flex align-items-center justify-content-end ms-auto me-4">
          <Link to="/mycart">
            <button className="btn text-light me-2" style={{ background: "radial-gradient(#FF8800 50%, #CC0000)" }}> 
              <i className="fa fa-cart-shopping " aria-hidden="true"></i>
              Cart &nbsp;
              <i className="fa fa-shopping-cart " aria-hidden="true"></i>
              <span className="badge bg-light text-dark ms-2">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </button>
          </Link>
           <span
              className="me-2 fw-semibold d-flex align-items-center"
            >
              {user?.name?.split(" ")[0] || "Default User"}

              <img
                src={getFileUrl(user?.profilePic)}
                alt="User"
                className="img-thumbnail ms-2"
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                  objectFit: "contain",
                }}
              />
            </span>

            <i
              className="fa-solid fa-circle-user"
              style={{
                fontSize: "45px",
                color: "#888",
              }}
            ></i> &nbsp; &nbsp; &nbsp;
            <Link to="/cancelledorders">
            <span className="d-flex flex-column"
               style={{ lineHeight: "1" ,cursor:"pointer",textDecoration:"none"}} 
            >
              <small>Cancel All</small>
              <strong>Orders</strong>
            </span>
            </Link>
          </div>

        </div>
      </div>
   </div>   
  </div> 
  {sticky && <div style={{ height: "56px" }}></div>}

      {/* Navigation */}

      <nav
        className="navbar navbar-expand-lg bg-mycolor navbar-dark py-1.3" >
        <div className="container">

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
             aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-center p-2"
            id="navbarNav"
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink to="/" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                  <i className="fa fa-thumbs-up me-1"></i>For You
                </NavLink>
              </li> 
              <li className="nav-item">
                <NavLink to="/fresh" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                  <i className="fa fa-leaf me-1" aria-hidden="true"></i>Fresh
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink to="/product" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                  <i className="fa fa-product-hunt me-1" aria-hidden="true"></i>
                  Product
                </NavLink>            
              </li>
               <li className="nav-item">
                <NavLink to="/todaydeals" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                 <i className="fa fa-fire me-1" aria-hidden="true"></i>
                  Today<sup>,</sup>s Deals
                </NavLink>                
              </li> 
              <li className="nav-item">
                <NavLink to="/myorder" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                 <i className="fa fa-shopping-bag me-1" aria-hidden="true"></i>
                  My Order
                </NavLink>                
              </li>
              <li className="nav-item">
                <NavLink to="/home" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                  <i className="fa fa-home me-1" aria-hidden="true"></i>
                  Home
                </NavLink>              
              </li> 
              <li className="nav-item">
                <NavLink to="/watchlist" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                  <i className="fa fa-th-list me-1" aria-hidden="true"></i>
                  Watchlist
                </NavLink>
              </li> 
              <li className="nav-item">
                <NavLink to="/customersupport" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                  <i className="fa fa-map-marker me-1" aria-hidden="true"></i>
                  Customer Support
                </NavLink>               
              </li>
               <li className="nav-item">
                <NavLink to="/myprofile" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                 <i className="fa fa-user me-1" aria-hidden="true"></i>
                  My Profile
                </NavLink>                
              </li>
              <li className="nav-item">
                <NavLink to="/youraccount" className={({isActive}) =>isActive ? "nav-link-custom active": "nav-link-custom"}>
                  <i className="fa fa-university me-1" aria-hidden="true"></i>
                  Your Account
                </NavLink>                
              </li>  
              <li className="nav-item">
                <button
                  type="button"
                  onClick={logout}
                  className="nav-link-custom signout-btn"
                >
                  <i className="fa fa-unlock-alt me-1"></i>
                  Sign Out
                </button>
              </li>

            </ul>
          </div>

        </div>
      </nav>
  

    </>
  );
}

export default Navbar;
