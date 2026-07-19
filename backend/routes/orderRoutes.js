const express = require("express");
const {createOrder,deleteOrder,getMyOrders,getCancelledOrders,updateOrderStatus} = require("../controllers/orderController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, createOrder);
router.get("/my", protect, getMyOrders);
router.get("/cancelled", protect, getCancelledOrders);
router.put("/:orderId/status", protect, updateOrderStatus);
router.delete("/:orderId", protect, deleteOrder);

module.exports = router;
