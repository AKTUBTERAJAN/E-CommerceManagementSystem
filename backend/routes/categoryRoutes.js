const express = require("express");
const router = express.Router();
const { addCategory, getCategories } = require("../controllers/category");
const protect = require("../middleware/authMiddleware");

router.post("/add", protect, addCategory);

router.get("/list", getCategories);

module.exports = router;
