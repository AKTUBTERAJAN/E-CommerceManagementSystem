import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductSidebar from "./productsidebar";
import ProductCard from "./productcard";

function Hero() {
  //Product Side bard data
  const subcat = [
  {
    id: 1,
    subcategory_name: "Potato",
  },
  {
    id: 2,
    subcategory_name: "Tomato",
  },
  {
    id: 3,
    subcategory_name: "Apple",
  },
  {
    id: 4,
    subcategory_name: "Banana",
  },
  {
    id: 5,
    subcategory_name: "Masala",
  },
  {
    id: 6,
    subcategory_name: "Pine Apple",
  },
  {
    id: 7,
    subcategory_name: "Nestel Milkmaid",
  },
  {
    id: 8,
    subcategory_name: "Cold Drink",
  },
  {
    id: 9,
    subcategory_name: "Cleaner",
  },
  {
    id: 10,
    subcategory_name: "Pharma Product",
  },
  {
    id: 11,
    subcategory_name: "Chips",
  },
  {
    id: 12,
    subcategory_name: "Baby Care",
  },
];

//Product Card Data
const products = [
 {
    id: 1,
    sid:5,
    subcategory_name: "Masala",
    product_quantity: "1 Kg",
    price: 1200,
    discount_price: 960,
    total_discount: 20,
    product_pic: "media/masala.png",
  },
  {
    id: 2,
    sid:3,
    subcategory_name: "Apple",
    product_quantity: "1 Kg",
    price: 100,
    discount_price: 70,
    total_discount: 30,
    product_pic: "media/Apple2.jpg",
  },
  
  {
    id: 3,
    sid:7,
    subcategory_name: "Nestte Milk",
    product_quantity: "1 Ltr.",
    price: 60,
    discount_price: 54,
    total_discount: 10,
    product_pic: "media/Milk.jpg",
  },
  {
    id: 4,
    sid:6,
    subcategory_name: "Pine Apple",
    product_quantity: "2 Pc.",
    price: 200,
    discount_price: 180,
    total_discount: 10,
    product_pic: "media/pineapple.jpg",
  },
  {
    id: 5,
    sid:2,
    subcategory_name: "Tomato",
    product_quantity: "1 kg.",
    price: 40,
    discount_price: 32,
    total_discount: 20,
    product_pic: "media/tomatoes.jpg",
  },
  {
    id: 6,
    sid:1,
    subcategory_name: "Potato",
    product_quantity: "1 kg.",
    price: 25,
    discount_price: 20,
    total_discount: 20,
    product_pic: "media/patato.jpg",
  },
  {
    id: 7,
    sid:8,
    subcategory_name: "Cold Drink",
    product_quantity: "1 Ltr.",
    price: 100,
    discount_price: 80,
    total_discount: 20,
    product_pic: "media/cold drink.png",
  },
  {
    id: 8,
    sid:4,
    subcategory_name: "Banana",
    product_quantity: "12 Pcs.",
    price: 60,
    discount_price: 48,
    total_discount: 20,
    product_pic: "media/Banana.jpg",
  },
  {
    id: 9,
    sid:9,
    subcategory_name: "Cleaner",
    product_quantity: "1 Pc.",
    price: 100,
    discount_price: 70,
    total_discount: 30,
    product_pic: "media/3785434.jpg",
  },
  {
    id: 10,
    sid:10,
    subcategory_name: "Pharma Product",
    product_quantity: "1 Pc.",
    price: 100,
    discount_price: 80,
    total_discount: 20,
    product_pic: "media/Pharma.png",
  },
  {
    id: 11,
    sid:11,
    subcategory_name: "Chips",
    product_quantity: "12 Pck.",
    price: 60,
    discount_price: 48,
    total_discount: 20,
    product_pic: "media/chips1.jpg",
  },
  {
    id: 12,
    sid:12,
    subcategory_name: "Baby Care",
    product_quantity: "200 ML",
    price: 200,
    discount_price: 160,
    total_discount: 20,
    product_pic: "media/Baby care.png",
  },

];


const [searchParams] = useSearchParams();

const sid = searchParams.get("sid");

const filteredProducts = sid
  ? products.filter((p) => p.sid === Number(sid))
  : products;
     
  return (
    <>
      <div class="text-center fs-2">
    Our <b class="txt-mycolor"><u>Product</u> <i className="fa fa-product-hunt me-1" aria-hidden="true"></i></b>
</div>
      <div class="row p-4">
        <div class="col-sm-2">
          <ProductSidebar
  subcat={subcat}
/>
          
        </div>
        <div class="col-sm-10">
          <div className="row">

            {filteredProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
            ))}

          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;