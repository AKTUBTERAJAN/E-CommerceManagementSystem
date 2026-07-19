const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getWatchlist,
  addToWatchlist,
  removeWatchlist,
} = require("../controllers/watchlistController");

// Get All Watchlist
router.get("/", protect, getWatchlist);

// Add Product
router.post("/add", protect, addToWatchlist);

// Remove Product
router.delete("/:id", protect, removeWatchlist);

module.exports = router;