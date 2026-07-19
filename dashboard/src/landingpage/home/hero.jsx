import React, { useEffect, useState } from "react";
import LeftProducts from "./leftproduct";
import Slider from "./slider";
import Category from "./category";
import TodayDeals from "./todaydeals";
import LatestProducts from "./latestproduct";

import { getCategories } from "../../api/category";
import { getProducts } from "../../api/products";

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
        getProducts({ deals: true }),
        getProducts({ latest: true }),
      ]);

      console.log("Categories:", categoryData);
      console.log("Deals:", dealsData);
      console.log("Latest:", latestData);

      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setDeals(Array.isArray(dealsData) ? dealsData : []);
      setLatestProducts(Array.isArray(latestData) ? latestData : []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row p-2">
        <LeftProducts />
        <Slider />
      </div>

      <Category cdata={categories} />
      <TodayDeals deals={deals} />
      <LatestProducts pdata={latestProducts} />
    </div>
  );
}

export default Home;