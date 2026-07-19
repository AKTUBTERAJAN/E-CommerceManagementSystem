const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const Product = require("../models/Products");
const connectDB = require("../config/db");

const updateData = async () => {
  try {
    await connectDB();

    // Sab products me fields add karega
    await Product.updateMany(
      {},
      {
        $set: {
         
          isLatest:false,
        },
      }
    );

    // For You -> Today Deals
    

    // For You -> Latest Products
    

    console.log("For You fields updated successfully.");
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

updateData();