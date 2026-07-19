const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {getWatchlist,addToWatchlist,removeWatchlist} = require("../controllers/watchlistController");


router.get("/", protect, getWatchlist);

router.post("/add", protect, addToWatchlist);

router.delete("/:id", protect, removeWatchlist);

module.exports = router;