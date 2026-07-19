const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {getWallet,addMoney,deductMoney} = require("../controllers/walletController");


router.get("/", protect, getWallet);

router.post("/add", protect, addMoney);

router.post("/deduct", protect, deductMoney);

module.exports = router;