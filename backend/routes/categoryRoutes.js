const express = require("express");
const router = express.Router();
const { addCategory, getCategories } = require("../controllers/category");
const protect = require("../middleware/authMiddleware");

// Add Category
router.post("/add", protect, addCategory);

// Get Categories
router.get("/list", getCategories);

module.exports = router;
