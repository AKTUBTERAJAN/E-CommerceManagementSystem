import React, { useEffect, useState } from "react";
import LeftProducts from "./leftproduct";
import Slider from "./slider";
import Category from "./category";
import TodayDeals from "./todaydeals";
import LatestProducts from "./latestproduct";
import { getCategories } from "../../api/category";
import { getProducts } from "../../api/products";

function Home() {
  //category section code
  const categoryData = [
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

  //Todays Deals
  const [deals, setDeals] = useState([]);

  //Latest Product 
  const [latestProducts, setLatestProducts] = useState([]);

  const [categories, setCategories] = useState(categoryData);
  const [todayDeals, setTodayDeals] = useState(deals);
  const [latestItems, setLatestItems] = useState(latestProducts);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [categoryResult, dealsResult, latestResult] = await Promise.allSettled([
          getCategories(),
          getProducts({ deals: true }),
          getProducts({ latest: true }),
        ]);

        if (categoryResult.status === "fulfilled" && categoryResult.value?.data?.length) {
          const backendCategories = categoryResult.value.data;
          const mergedCategories = categoryData.map((item, index) => {
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

        if (dealsResult.status === "fulfilled" && dealsResult.value?.data?.length) {
          setTodayDeals(dealsResult.value.data);
        }

        if (latestResult.status === "fulfilled" && latestResult.value?.data?.length) {
          setLatestItems(latestResult.value.data);
        }
      } catch (error) {
        console.error("Failed to load home data", error);
      }
    };

    loadHomeData();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row p-2">
          <LeftProducts />
          <Slider />
        </div>
        <Category cdata={categories} />
        <TodayDeals deals={todayDeals} />
        <LatestProducts pdata={latestItems} />
      </div>
    </>
  );
}

export default Home;
