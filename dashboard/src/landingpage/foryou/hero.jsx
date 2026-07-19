import React, { useEffect, useState } from "react";
import Category from "./category";
import TodayDeals from "./todaydeals";
import LatestProducts from "./latestproduct";

import { getProducts } from "../../api/products";
import { getCategories } from "../../api/category";

function Home() {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [categoryData, dealsData, latestData] = await Promise.all([
        getCategories(),
        getProducts({ foryoudeal: true }),
        getProducts({ foryoulatest: true }),
      ]);

      console.log("Categories:", categoryData);
      console.log("Deals:", dealsData);
      console.log("Latest:", latestData);

      setCategories(categoryData || []);
      setDeals(dealsData || []);
      setLatestProducts(latestData || []);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="text-center fs-2 mb-2">
        <h1
          style={{
            fontSize: "48px",
            fontWeight: "700",
            fontFamily: "Arial, sans-serif",
            margin: 0,
          }}
        >
          <span style={{ color: "#222222" }}>For</span>

          <span className="txt-mycolor">
            <u>You</u>{" "}
            <i className="fa fa-thumbs-up me-1" aria-hidden="true"></i>
          </span>
        </h1>
      </div>

      <div className="container-fluid">
        <Category cdata={categories} />
        <TodayDeals deals={deals} />
        <LatestProducts pdata={latestProducts} />
      </div>
    </>
  );
}

export default Home;