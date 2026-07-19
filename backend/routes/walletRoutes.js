const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getWallet,
  addMoney,
  deductMoney,
} = require("../controllers/walletController");

// Get Wallet
router.get("/", protect, getWallet);

// Add Money
router.post("/add", protect, addMoney);

// Deduct Money
router.post("/deduct", protect, deductMoney);

module.exports = router;