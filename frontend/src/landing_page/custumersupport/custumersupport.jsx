import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "./hero";
import AISupportSection from "./AISupportSection";

function CustomerSupport() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Hero />
      <AISupportSection />
    </>
  );
}

export default CustomerSupport;
