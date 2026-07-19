const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const Product = require("../models/Products");
const connectDB = require("../config/db");

console.log("MONGO_URI =", process.env.MONGO_URI);

const products = [
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
    id: 17,
    sid:17,
    subcategory_name: "Mint Leaves",
    product_quantity: "100 g.",
    price: 20,
    discount_price: 10,
    total_discount: 50,
    product_pic: "media/MintLeaves.jpg",
  },
  {
    id: 18,
    sid:18,
    subcategory_name: "Leman",
    product_quantity: "4 pcs.",
    price: 30,
    discount_price: 21,
    total_discount: 30,
    product_pic: "media/Nibu.jpg",
  },
   {
    id: 14,
    sid:14,
    subcategory_name: "Onion",
    product_quantity: "1 Kg.",
    price: 52,
    discount_price: 40,
    total_discount: 23,
    product_pic: "media/pyaj.jpg",
  },
  
  {
    id: 15,
    sid:15,
    subcategory_name: "Bhindi",
    product_quantity: "500 g.",
    price: 40,
    discount_price: 20,
    total_discount: 50,
    product_pic: "media/Bhindi.jpg",
  },
  {
    id: 16,
    sid:16,
    subcategory_name: "Lehsun",
    product_quantity: "100 g.",
    price: 40,
    discount_price: 20,
    total_discount: 50,
    product_pic: "media/lehsun.jpg",
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
  {
    id: 19,
    subcategory_name: "Atta,Rice",
    product_quantity: "1 Kg.",
    price: 50,
    discount_price: 30,
    total_discount: 40,
    product_pic: "media/ata.png",
  },
   {
    id: 20,
    subcategory_name: "Oil",
    product_quantity: "1 Ltr.",
    price: 150,
    discount_price: 120,
    total_discount: 20,
    product_pic: "media/oil.webp",
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
    id: 3,
    subcategory_name: "Nestte Milk",
    product_quantity: "1 Ltr.",
    price: 60,
    discount_price: 54,
    total_discount: 10,
    product_pic: "media/Milk.jpg",
  },
  {
    id: 21,
    subcategory_name: "Harlicks",
    product_quantity: "1 kg.",
    price: 250,
    discount_price: 200,
    total_discount: 20,
    product_pic: "media/horlicks.png",
  },
  {
    id: 22,
    subcategory_name: "Pan",
    product_quantity: "1 pcs.",
    price: 50,
    discount_price: 45,
    total_discount: 10,
    product_pic: "media/pan.png",
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
];

const importData = async () => {
  try {
    await connectDB();

    // deleteMany ko abhi comment kar do, warna purane products delete ho jayenge
    // await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products Inserted Successfully");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

importData();