import React from "react";
import Hero from "./hero";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function CustomerSupport() {
  const { pathname } = useLocation();
          useEffect(() => {
              window.scrollTo(0, 0);
      }, 
      [pathname]);
  return (
    <>
        <Hero />
    </>
  );
}

export default CustomerSupport;