const express = require("express");
const {
  addProduct,
  getProducts,
  searchProducts,
  getRecommendations,
  getSubcategories,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/list", getProducts);
router.get("/search", searchProducts);
router.get("/recommendations", getRecommendations);
router.get("/subcategories", getSubcategories);
router.post("/add", protect, addProduct);

module.exports = router;
