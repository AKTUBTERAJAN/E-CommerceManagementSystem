const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    subcategory_name: { type: String, required: true },
    product_quantity: { type: String, required: true },
    price: { type: Number, required: true },
    discount_price: { type: Number, required: true },
    total_discount: { type: Number, default: 0 },
    product_pic: { type: String, default: "" },
    sid: { type: Number },
    isDeal: { type: Boolean, default: false },
    isLatest: { type: Boolean, default: true },
    isFresh: { type: Boolean, default: true },
    //isForyou: { type: Boolean, default: false },
    isForYouDeal: {type: Boolean, default: true,},
    isForYouLatest: {type: Boolean, default: true,},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
