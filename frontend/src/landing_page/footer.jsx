import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function Footer() {
  const { pathname } = useLocation();
        useEffect(() => {
            window.scrollTo(0, 0);
    }, 
    [pathname]);
    return (
    <footer className=' border-top ' >
    
      <div className="row ufooter bg-dark">
      <div className="col-4">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://org.gem.gov.in/aboutus">
          <img
            src="media/Government.png"
            alt=""
            style={{ height: "95px", width: "300px", paddingTop: "20px" }}
          />
        </a>

        <br />

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://www.startupindia.gov.in/">
          <img
            src="media/startupindia.png"
            alt=""
            style={{ height: "95px", width: "300px", paddingTop: "10px" }}
          />
        </a>

        <br />

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://www.youtube.com/@UPHUB369">
          <img
            src="media/uphub.jpg"
            alt=""
            style={{ height: "95px", width: "300px", paddingTop: "10px" }}
          />
        </a>

        <br />

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://play.google.com/store/apps/details?id=com.techpile&pli=1">
          <img
            src="media/GooglePlay.png"
            alt=""
            style={{ height: "95px", width: "300px", paddingTop: "10px" }}
          />
        </a>
      </div>

      <div className="col-sm-4">
        <br />

        <h1 style={{ color: "white" }}>
          <u>Contact </u>Info
        </h1>

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <b style={{ color: "darkorange", fontSize: "20px" }}>
          <i class="fa fa-map-marker" aria-hidden="true"></i>
          <u>Mall </u>Address
        </b>

        <p style={{ color: "white" }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plot No-55,Near by Banthara
          Post Office
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kanpur Road, Banthara
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Banthara,Lucknow
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Uttar Pradesh 226401
        </p>

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <b style={{ color: "darkorange", fontSize: "20px" }}>
          <i class="fa fa-phone-square" aria-hidden="true"></i>
          <u>Call </u>Us
        </b>

        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href="tel:+919653028979"
            style={{ textDecoration: "none", color: "white" }}
          >
            +91 9653028979
          </a>

          <br />

          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href="tel:+917052435535"
            style={{ textDecoration: "none", color: "white" }}
          >
            +91 7052435535
          </a>
        </p>

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <b style={{ color: "darkorange", fontSize: "20px" }}>
          <i class="fa fa-envelope" aria-hidden="true"></i>
          <u>Mail </u>US
        </b>

        <p>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a
            href="mailto:rajankushwaha819@gmail.com"
            style={{ textDecoration: "none", color: "white" }}
          >
            rajankushwaha819@gmail.com
          </a>
        </p>
      </div>

      <div className="col-4">
        <p style={{ color: "rgb(255, 166, 0)", fontSize: "50px" }}>
          <b>
            Big <u>Mall</u>
          </b>
        </p>

        <p style={{ color: "white" }}>
          It is a E-commerce Site to sell the many product like food, helth
          product, cleaning product, baby product, cold drink and etc. So our
          visit of my website and purchesh some products and give the feedback
          and encourage my website.
        </p>

        <p style={{ color: "rgb(255, 166, 0)", fontSize: "25px" }}>
          <b>
            <u>Stay Con</u>nected
          </b>
        </p>

        <a
          href="https://www.instagram.com/rajanofficer/"
          style={{ color: "white" }}
        >
          <i class="fa fa-instagram me-2" aria-hidden="true"></i>
        </a>

        &nbsp;&nbsp;&nbsp;

        <a
          href="https://www.facebook.com/rajan.kushwaha.5836"
          style={{ color: "white" }}
        >
          <i class="fa fa-facebook-square me-2" aria-hidden="true"></i>
        </a>

        &nbsp;&nbsp;&nbsp;

        <a
          href="https://wa.me/qr/M6BTGA4MJQDNA1"
          style={{ color: "white" }}
        >
          <i class="fa fa-whatsapp me-2" aria-hidden="true"></i>
        </a>

        &nbsp;&nbsp;&nbsp;

        <a
          href="https://www.youtube.com/@UPHUB369/videos"
          style={{ color: "white" }}
        >
        <i class="fa fa-youtube-play me-2" aria-hidden="true"></i>
        </a>

        &nbsp;&nbsp;&nbsp;

        <a
          href="https://twitter.com/RAJANKU63374902"
          style={{ color: "white" }}
        >
          <i class="fa fa-twitter-square me-2" aria-hidden="true"></i>
        </a>
      </div>
    </div>
    <div className="row bfooter bg-dark mt-1 ">
      <div className="col-6">
        <p style={{ color: "white", fontSize: "15px", lineHeight: "40px" }}>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;© 2026{" "}
          <a
            href="/"
            style={{ color: "rgb(255, 166, 0)", textDecoration: "none" }}
          >
            Big Mall
          </a>{" "}
          2026 | Developed By{" "}
          <u>
           <Link
            to="/customersupport"
            style={{ color: "rgb(255, 166, 0)" }}
          >
            Mr. RAJAN KUSHWAHA
          </Link>
          </u>
        </p>
      </div>

      <div className="col-6">
                <Link
            className="nav-link"
            to="/privacy"
            style={{
              color: "rgb(255, 166, 0)",
              textDecoration: "none",
              lineHeight: "40px",
            }}
          >
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Privacy and Policy
        </Link>
      </div>
    </div>   
        
    </footer> 
     );
}

export default Footer;
