import React, { useEffect, useState } from "react";
import TodayDeals from "./todaydeals";
import { getProducts } from "../../api/products";

function Home() {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      const data = await getProducts({
        deals: true,
      });

      console.log("Deals =", data);

      setDeals(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container-fluid">
      <TodayDeals deals={deals} />
    </div>
  );
}

export default Home;