const express = require("express");
const {
  addProduct,
  getProducts,
  getSubcategories,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/list", getProducts);
router.get("/subcategories", getSubcategories);
router.post("/add", protect, addProduct);

module.exports = router;
