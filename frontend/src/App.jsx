import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './landing_page/navbar';
import Homepage1 from './landing_page/home/homepage';
import About from './landing_page/about/about';
import Product from './landing_page/product/product';
import CustomerSupport from './landing_page/custumersupport/custumersupport';
import Signup from './landing_page/signup/signup';
import Signin from './landing_page/signin/signin';
import Footer from './landing_page/footer';
import Privacy from './landing_page/privacy/privacy';
import NotFound from './landing_page/notfound';

function ProfileRedirect() {
  useEffect(() => {
    const isLocal =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
       window.location.hostname === "127.0.0.1");

    const envUrl = (import.meta.env.VITE_DASHBOARD_URL || "").trim().replace(/\/+$/, "");
    const dashboardBase = isLocal
      ? (!envUrl || envUrl.includes("vercel.app") || envUrl.includes("onrender.com") ? "http://localhost:5174" : envUrl)
      : (envUrl || "https://bigmall-dashboard.vercel.app");

    window.location.href = `${dashboardBase}/myprofile${window.location.search || ""}`;
  }, []);

  return (
    <div className="container text-center py-5">
      <h4>Redirecting to Dashboard...</h4>
    </div>
  );
}

function Homepage() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage1 />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/customersupport" element={<CustomerSupport />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/myprofile" element={<ProfileRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default Homepage;
