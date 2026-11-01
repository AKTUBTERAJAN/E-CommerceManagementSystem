//Home page

import React, { useEffect, useState } from "react";
import LeftProducts from "./leftproduct";
import Slider from "./slider";
import Category from "./category";
import TodayDeals from "./todaydeals";
import LatestProducts from "./latestproduct";
import AIRecommendations from "../../components/AIRecommendations/AIRecommendations";

import { getCategories } from "../../api/category";
import { getProducts } from "../../api/products";

function Home() {
  const defaultCategories = [
    {
      id: 1,
      sid: 19,
      cname: "Paan Corner",
      product_pic: "media/pan.png",
    },
    {
      id: 2,
      sid: 8,
      cname: "Cold drink",
      product_pic: "media/cold drink.png",
    },
    {
      id: 3,
      sid: 20,
      cname: "Oil",
      product_pic: "media/oil.webp",
    },
    {
      id: 4,
      sid: 3,
      cname: "Fruits",
      product_pic: "media/fruit.jpg",
    },
    {
      id: 5,
      sid: 21,
      cname: "Health Product",
      product_pic: "media/horlicks.png",
    },
    {
      id: 6,
      sid: 22,
      cname: "Atta, Rice & Dal",
      product_pic: "media/ata.png",
    },
  ];

  const [categories, setCategories] = useState(defaultCategories);
  const [deals, setDeals] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [categoryResult, dealsResult, latestResult] = await Promise.allSettled([
        getCategories(),
        getProducts({ deals: true }),
        getProducts({ latest: true }),
      ]);

      if (categoryResult.status === "fulfilled" && Array.isArray(categoryResult.value)) {
        const backendCategories = categoryResult.value;
        const mergedCategories = defaultCategories.map((item, index) => {
          const backendCategory = backendCategories[index];
          if (!backendCategory) return item;
          return {
            ...item,
            id: backendCategory.sid || backendCategory.id || item.id,
            cname: backendCategory.name || backendCategory.cname || item.cname,
            cpic: backendCategory.cpic || item.cpic,
          };
        });
        setCategories(mergedCategories);
      }

      if (dealsResult.status === "fulfilled" && Array.isArray(dealsResult.value)) {
        setDeals(dealsResult.value);
      }

      if (latestResult.status === "fulfilled" && Array.isArray(latestResult.value)) {
        setLatestProducts(latestResult.value);
      }
    } catch (error) {
      console.error("Home data load error:", error);
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
      <AIRecommendations limit={4} />
      <LatestProducts pdata={latestProducts} />
    </div>
  );
}

export default Home;
