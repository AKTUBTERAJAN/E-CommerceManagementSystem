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