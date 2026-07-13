import React from "react";
import LeftProducts from "./leftproduct";
import Slider from "./slider";
import Category from "./category"
import TodayDeals from "./todaydeals"
import LatestProducts from "./latestproduct"

import PaanCorner from "../../assets/pan.png";
import Colddrink from "../../assets/cold drink.png";
import Oil from "../../assets/oil.webp";
import Fruits from "../../assets/fruit.jpg";
import HealthProduct from "../../assets/horlicks.png";
import AttaRiceDal from "../../assets/ata.png";


function Home() {
  //category section code
  const categoryData = [
    {
      id: 1,
      cname: "Paan Corner",
      cpic: PaanCorner,
    },
    {
      id: 2,
      cname: "Cold drink",
      cpic: Colddrink,
    },
    {
      id: 3,
      cname: "Oil",
      cpic: Oil,
    },
    {
      id: 4,
      cname: "Fruits",
      cpic: Fruits,
    },
    {
      id: 5,
      cname: "Health Product",
      cpic: HealthProduct,
    },
    {
      id: 6,
      cname: "Atta, Rice & Dal",
      cpic: AttaRiceDal,
    },
    
  ];

  //Todays Deals
  const deals = [
  {
    id: 1,
    subcategory_name: "Masala",
    product_quantity: "1 Kg",
    price: 1200,
    discount_price: 960,
    total_discount: 20,
    product_pic: "media/masala.png",
  },
  {
    id: 2,
    subcategory_name: "Apple",
    product_quantity: "1 Kg",
    price: 100,
    discount_price: 70,
    total_discount: 30,
    product_pic: "media/Apple2.jpg",
  },
  {
    id: 3,
    subcategory_name: "Pine Apple",
    product_quantity: "2 Pc.",
    price: 200,
    discount_price: 180,
    total_discount: 10,
    product_pic: "media/pineapple.jpg",
  },
  {
    id: 4,
    subcategory_name: "Cleaner",
    product_quantity: "1 Pc.",
    price: 100,
    discount_price: 70,
    total_discount: 30,
    product_pic: "media/3785434.jpg",
  },
  {
    id: 5,
    subcategory_name: "Baby Care",
    product_quantity: "200 ML",
    price: 200,
    discount_price: 160,
    total_discount: 20,
    product_pic: "media/Baby care.png",
  },
];

//Latest Product 
const latestProducts = [
  {
    id: 1,
    subcategory_name: "Masala",
    product_quantity: "1 Kg",
    price: 1200,
    discount_price: 960,
    total_discount: 20,
    product_pic: "media/masala.png",
  },
  {
    id: 2,
    subcategory_name: "Apple",
    product_quantity: "1 Kg",
    price: 100,
    discount_price: 70,
    total_discount: 30,
    product_pic: "media/Apple2.jpg",
  },
  {
    id: 3,
    subcategory_name: "Nestte Milk",
    product_quantity: "1 Ltr.",
    price: 60,
    discount_price: 54,
    total_discount: 10,
    product_pic: "media/Milk.jpg",
  },
  {
    id: 4,
    subcategory_name: "Pine Apple",
    product_quantity: "2 Pc.",
    price: 200,
    discount_price: 180,
    total_discount: 10,
    product_pic: "media/pineapple.jpg",
  },
  {
    id: 5,
    subcategory_name: "Tomato",
    product_quantity: "1 kg.",
    price: 40,
    discount_price: 32,
    total_discount: 20,
    product_pic: "media/tomatoes.jpg",
  },
  {
    id: 6,
    subcategory_name: "Potato",
    product_quantity: "1 kg.",
    price: 25,
    discount_price: 20,
    total_discount: 20,
    product_pic: "media/patato.jpg",
  },
];

  return (
    <div className="container-fluid">
      <div className="row p-2">
        <LeftProducts />
        <Slider />
      </div>
       <Category cdata={categoryData}/>
       <TodayDeals deals={deals} />
       <LatestProducts pdata={latestProducts} />
    </div>
  );
}

export default Home;