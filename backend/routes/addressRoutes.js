const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {addAddress,getAddresses,updateAddress,deleteAddress} = require("../controllers/addressController");

router.post("/add", protect, addAddress);

router.get("/", protect, getAddresses);

router.put("/update/:id", protect, updateAddress);

router.delete("/delete/:id", protect, deleteAddress);

module.exports = router;