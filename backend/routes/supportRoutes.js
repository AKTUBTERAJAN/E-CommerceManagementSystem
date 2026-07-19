const express = require("express");
const {createSupportMessage,getSupportMessages} = require("../controllers/supportController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send", createSupportMessage);
router.get("/list", protect, getSupportMessages);

module.exports = router;
