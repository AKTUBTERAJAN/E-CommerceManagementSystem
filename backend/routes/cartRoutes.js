const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {addToCart,getCart,removeCartItem,clearCart} = require("../controllers/cartController");

router.post("/add", protect, addToCart);

router.get("/", protect, getCart);

router.delete("/:id", protect, removeCartItem);

router.delete("/clear/all", protect, clearCart);

module.exports = router;