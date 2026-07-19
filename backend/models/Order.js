const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, required: true, unique: true },
    product_pic: { type: String },
    subcategory_name: { type: String, required: true },
    product_quantity: { type: String },
    quantity: { type: Number, required: true },
    discount_price: { type: Number, required: true },
    total_price: { type: Number, required: true },
    added_date: { type: String },
    status: { type: String, default: "Order Confirmed" },
    statusStep: { type: Number, default: 0 },
    cancelledAt: {type: Date,default: null,},
    payment_method: { type: String, default: "Wallet" },
    customer: {
      name: { type: String, required: true },
      mobile: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
