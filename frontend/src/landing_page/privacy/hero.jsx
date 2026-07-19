import React, { useState } from "react";

function Hero() {
  
  return (
    <>
      <style>{`
        .privacy-page{
          background:#f5f5f5;
          min-height:100vh;
          padding-bottom:50px;
        }

        .privacy-banner{
          background:linear-gradient(90deg,#ff9800,#ff5722);
          color:#fff;
          text-align:center;
          padding:10px 20px;
        }

        .privacy-banner h1{
          font-size:42px;
          font-weight:bold;
          margin-bottom:10px;
        }

        .privacy-banner p{
          font-size:18px;
          margin:0;
        }

        .privacy-container{
          width:90%;
          max-width:1200px;
          margin:40px auto;
        }

        .privacy-card{
          background:#fff;
          padding:40px;
          border-radius:10px;
          box-shadow:0 5px 15px rgba(0,0,0,.1);
        }

        .privacy-card h2{
          color:#ff6600;
          margin-top:30px;
          margin-bottom:15px;
        }

        .privacy-card p{
          color:#555;
          line-height:1.8;
          text-align:justify;
        }

        .privacy-card ul{
          padding-left:25px;
        }

        .privacy-card li{
          margin-bottom:10px;
          color:#555;
        }

        .privacy-footer{
          text-align:center;
          margin-top:40px;
          color:#777;
          font-size:15px;
        }

        @media(max-width:768px){

          .privacy-banner h1{
            font-size:30px;
          }

          .privacy-card{
            padding:20px;
          }

        }
      `}</style>

      <div className="privacy-page">

        <div className="privacy-banner">
          <h1>
            <i className="fa fa-user-secret"></i> Privacy Policy
          </h1>
          <p>Your Privacy is Important to BigMall</p>
        </div>

        <div className="privacy-container">

          <div className="privacy-card">

            <p>
              Welcome to <strong>BigMall</strong>. We value your trust and are
              committed to protecting your personal information. This Privacy
              Policy explains how we collect, use, store and protect your data
              whenever you use our website.
            </p>

            <h2>1. Information We Collect</h2>

            <ul>
              <li>Name</li>
              <li>Email Address</li>
              <li>Mobile Number</li>
              <li>Shipping Address</li>
              <li>Billing Address</li>
              <li>Order Details</li>
              <li>IP Address</li>
              <li>Browser Information</li>
            </ul>

            <h2>2. How We Use Your Information</h2>

            <ul>
              <li>Process your orders</li>
              <li>Deliver products</li>
              <li>Customer Support</li>
              <li>Send order updates</li>
              <li>Improve website performance</li>
              <li>Prevent fraud</li>
              <li>Provide personalized shopping experience</li>
            </ul>

            <h2>3. Cookies</h2>

            <p>
              BigMall uses cookies to improve your browsing experience,
              remember your preferences and analyze website traffic.
            </p>

            <h2>4. Data Security</h2>

            <p>
              We use secure technologies and industry-standard security
              practices to protect your personal information from unauthorized
              access or misuse.
            </p>

            <h2>5. Information Sharing</h2>

            <p>
              We never sell your personal information. Your data may only be
              shared with trusted delivery partners and payment providers to
              complete your orders.
            </p>

            <h2>6. Payment Security</h2>

            <p>
              Payments are processed through secure payment gateways. BigMall
              never stores your card or banking information.
            </p>

            <h2>7. Your Rights</h2>

            <ul>
              <li>Access your personal data</li>
              <li>Update your information</li>
              <li>Delete your account</li>
              <li>Unsubscribe from promotional emails</li>
            </ul>

            <h2>8. Third Party Links</h2>

            <p>
              Our website may contain links to third-party websites. We are not
              responsible for their privacy practices.
            </p>

            <h2>9. Policy Updates</h2>

            <p>
              BigMall may update this Privacy Policy at any time. Changes will
              be published on this page.
            </p>

            <h2>10. Contact Us</h2>

            <p>
              <strong>Email:</strong> support@bigmall.com
              <br />
              <strong>Phone:</strong> +91-9876543210
              <br />
              <strong>Address:</strong> Lucknow, Uttar Pradesh, India
            </p>

            <div className="privacy-footer">
              © 2026 BigMall. All Rights Reserved.
            </div>

          </div>

        </div>

      </div>
    </>
  );
}

export default Hero;
