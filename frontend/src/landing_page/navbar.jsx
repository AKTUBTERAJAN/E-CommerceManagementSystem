//NAVBAR PAGE

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DASHBOARD_URL } from "../config";

function Navbar() {
  const [sticky, setSticky] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (!token || token === "null" || token === "undefined") return null;
      return user && user !== "null" && user !== "undefined" ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      try {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        if (!token || token === "null" || token === "undefined") {
          setCurrentUser(null);
        } else {
          setCurrentUser(user && user !== "null" && user !== "undefined" ? JSON.parse(user) : null);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("bigmall_ai_chat_history");
      localStorage.removeItem("bigmall_ai_chat_guest");
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("bigmall_ai_chat_user_")) {
          localStorage.removeItem(key);
        }
      });
      setCurrentUser(null);
      window.dispatchEvent(new Event("storage"));
      window.history.replaceState({}, "", window.location.pathname);
    }

    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("bigmall_ai_chat_history");
    localStorage.removeItem("bigmall_ai_chat_guest");
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("bigmall_ai_chat_user_")) {
        localStorage.removeItem(key);
      }
    });
    setCurrentUser(null);
    window.dispatchEvent(new Event("storage"));
    alert("Signed Out Successfully");
    navigate("/");
  };

  const openCart = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      alert("Please Login First to view your Cart");
      navigate("/signin");
      return;
    }
    window.location.href = `${DASHBOARD_URL}/mycard?token=${encodeURIComponent(token)}`;
  };

  const openOrders = () => {
    const token = localStorage.getItem("token");
    if (!token || token === "null" || token === "undefined") {
      alert("Please Login First to view your Orders");
      navigate("/signin");
      return;
    }
    window.location.href = `${DASHBOARD_URL}/myorder?token=${encodeURIComponent(token)}`;
  };

  const checkLogin = () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || user === "null" || user === "undefined" || !token || token === "null" || token === "undefined") {
      alert("Please Login First");
      navigate("/signin");
      return;
    }

    window.location.href = `${DASHBOARD_URL}/myprofile?token=${encodeURIComponent(token)}`;
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchQuery.trim())}`);
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
        className="row t1 text-center bg-mycolor text-light py-1"
        style={{
          fontSize: "15px",
        }}
      >
        <div className="container navbar-fixed">
          <div className="row t1 text-center bg-mycolor text-light py-1">
            <div className="col-lg-3 col-md-6 col-sm-12 ">
              <i className="fa fa-envelope me-1" aria-hidden="true"></i>
              <a
                href="https://mail.google.com/mail/u/0/?plid=ACUX6DNC887NW1zuvzhpkNc6wMpBo3WY3lOO_iU#all"
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

      <div className={`${sticky ? "fixed-nav" : ""}`}>
        {/* Middle Header */}
        <div
          style={{
            background: sticky
              ? "linear-gradient(to right,#ffd400,#ff7b00,#d50000,#7f6000,#73b300)"
              : "#ffffff",
            transition: "0.4s ease",
          }}
        >
          <div className="py-2">
            <div className="row align-items-center">
              <div className="col-1 d-none d-lg-block"></div>
              <div className="col-lg-3 col-md-3 text-center text-md-start mb-2 mb-md-0">
                <Link to="/">
                  <img src="media/BigMall.png" style={{ height: "55px" }} alt="BigMall" />
                </Link>
              </div>

              {/* AI Smart Search Input */}
              <div className="col-lg-3 col-md-3 d-flex align-items-center justify-content-center ms-auto me-auto">
                <form onSubmit={handleSearchSubmit} className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search e.g. Best shoes under 2000..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      borderRadius: "20px 0 0 20px",
                      borderColor: "#ff8800",
                      fontSize: "13.5px",
                      paddingLeft: "14px",
                    }}
                  />
                  <button
                    className="btn text-light"
                    type="submit"
                    style={{
                      background: "linear-gradient(135deg, #ff8800, #cc0000)",
                      borderRadius: "0 20px 20px 0",
                      borderColor: "#ff8800",
                      padding: "0 16px",
                    }}
                    title="AI Smart Search"
                  >
                    <i className="fa fa-search" aria-hidden="true"></i>
                  </button>
                </form>
              </div>

              <div className="col-lg-4 col-md-5 d-flex align-items-center justify-content-end ms-auto me-4">
                <button
                  className="btn text-light me-2"
                  style={{ background: "radial-gradient(#FF8800 50%, #CC0000)" }}
                  onClick={openCart}
                  title={currentUser ? "View Cart" : "Sign In to view Cart"}
                >
                  <i className="fa fa-cart-shopping " aria-hidden="true"></i>
                  Cart &nbsp;
                  <i className="fa fa-shopping-cart " aria-hidden="true"></i>
                  <span className="badge bg-light text-dark ms-2">0</span>
                </button>

                <span
                  className="me-2 fw-semibold"
                  onClick={checkLogin}
                  style={{ cursor: "pointer" }}
                  title={currentUser ? "Open Profile & Dashboard" : "Sign In"}
                >
                  {currentUser ? currentUser.name : "Guest / Sign In"}
                  <img
                    src="media/user.png"
                    alt="User"
                    className="img-thumbnail ms-2"
                    style={{ height: "40px" }}
                  />
                </span>

                <i
                  className="fa-solid fa-circle-user"
                  style={{
                    fontSize: "45px",
                    color: "#888",
                    cursor: "pointer",
                  }}
                  onClick={checkLogin}
                  title="My Profile"
                ></i>
                &nbsp; &nbsp; &nbsp;
                <span
                  className="d-flex flex-column"
                  style={{ lineHeight: "1", cursor: "pointer" }}
                  onClick={openOrders}
                  title="My Orders"
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
      <nav className="navbar navbar-expand-lg bg-mycolor navbar-dark py-1.3">
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
                  <i className="fa fa-map-marker me-1" aria-hidden="true"></i>
                  Customer Support
                </Link>
              </li>

              {currentUser ? (
                <>
                  <li className="nav-item">
                    <span
                      className="nav-link text-warning fw-bold"
                      style={{ cursor: "pointer" }}
                      onClick={checkLogin}
                      title="Open Dashboard"
                    >
                      <i className="fa fa-user-circle me-1"></i>
                      {currentUser.name}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link text-white fw-bold btn btn-link"
                      onClick={handleLogout}
                      style={{ textDecoration: "none", border: "none", background: "none" }}
                    >
                      <i className="fa fa-sign-out me-1"></i>
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
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
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
