import React, { useEffect, useState } from "react";
import { Link,useNavigate  } from "react-router-dom";


function Navbar() {
   const [sticky, setSticky] = useState(false);
   const navigate = useNavigate();

const checkLogin = () => {
  const user = localStorage.removeItem("user");
  console.log("User =", user);

  if (!user || user === "null" || user === "undefined") {
    alert("Please Login First");
    navigate("/signin");
    return;
  }
};

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
              <i class="fa fa-envelope me-1" aria-hidden="true"></i>
              <a
                href="https://mail.google.com/mail/u/0/?plid=ACUX6DNC887NW1zuvzhpkNc6wMpBo3WY3lOO_iU#all"
                className="text-white text-decoration-none"
              >
                rajankushwaha819@gmail.com
              </a>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-12">
              <i class="fa fa-phone-square me-1" aria-hidden="true"></i>
              <a
                href="tel:+919653028979"
                className="text-white text-decoration-none"
              >
                +91 9653028979
              </a>
            </div>

            <div className="col-lg-4 col-md-8 col-sm-12">
             <i class="fa fa-certificate me-1" aria-hidden="true"></i>
              An ISO Certified E-Commerce Company
            </div>

            <div className="col-lg-2 col-md-4 col-12">
              <a href="https://www.instagram.com/uphub369/" className="text-white me-2">
                <i class="fa fa-instagram" aria-hidden="true"></i>
              </a>

              <a href="https://www.facebook.com/rajan.kushwaha.5836/" className="text-white me-2">
                <i class="fa fa-facebook-square" aria-hidden="true"></i>
              </a>

              <a href="https://web.whatsapp.com/" className="text-white me-2">
                <i class="fa fa-whatsapp" aria-hidden="true"></i>
              </a>

              <a href="https://www.youtube.com/@UPHUB369" className="text-white me-2">
                <i class="fa fa-youtube-play" aria-hidden="true"></i>
              </a>

              <a href="https://x.com/RAJANKU63374902" className="text-white">
                <i class="fa fa-twitter" aria-hidden="true"></i>
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
           
            <button className="btn text-light me-2" style={{ background: "radial-gradient(#FF8800 50%, #CC0000)" }} onClick={checkLogin}> 
              <i class="fa fa-cart-shopping " aria-hidden="true"></i>
              Cart &nbsp;
              <i class="fa fa-shopping-cart " aria-hidden="true"></i>
              <span className="badge bg-light text-dark ms-2">0</span>
            </button>

            <span className="me-2 fw-semibold"  onClick={checkLogin} style={{cursor: "pointer"}}>
              Default User
            <img src="media/user.png " alt="User" className="img-thumbnail ms-2" style={{  height: "40px" }} />
            </span>

            <i
              className="fa-solid fa-circle-user"
              style={{
                fontSize: "45px",
                color: "#888",
                cursor: "pointer",
              }}
               onClick={checkLogin}
            ></i> &nbsp; &nbsp; &nbsp;
            <span className="d-flex flex-column"
               style={{ lineHeight: "1" , cursor: "pointer"}}
               onClick={checkLogin}
            >
              <small>Cancel All</small>
              <strong>Orders</strong>
            </span>
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
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            <ul className="navbar-nav">

              <li className="nav-item">
                <Link className="nav-link text-white fw-bold" to="/">
                  <i className="fa fa-home me-1" aria-hidden="true"></i>
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-bold" to="/about">
                  <i className="fa fa-info-circle me-1" aria-hidden="true"></i>
                  About Us
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-bold" to="/product">
                  <i className="fa fa-product-hunt me-1" aria-hidden="true"></i>
                  Product
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-bold" to="/customersupport">
                  <i class="fa fa-map-marker me-1" aria-hidden="true"></i>
                  Customer Support
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-bold" to="/signup">
                  <i className="fa fa-user-plus me-1" aria-hidden="true"></i>  
                  Sign Up
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link text-white fw-bold" to="/signin">
                  <i className="fa fa-sign-in me-1" aria-hidden="true"></i>
                  Sign In
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </nav>
  

    </>
  );
}

export default Navbar;