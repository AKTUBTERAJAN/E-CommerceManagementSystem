const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addToCart,
  getCart,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

// Add Product To Cart
router.post("/add", protect, addToCart);

// Get Logged In User Cart
router.get("/", protect, getCart);

// Remove One Cart Item
router.delete("/:id", protect, removeCartItem);

// Clear Full Cart
router.delete("/clear/all", protect, clearCart);

module.exports = router;