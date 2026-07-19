const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      user: req.user.id,
      orderId: req.body.orderId || `BM${Date.now()}`,
      added_date: req.body.added_date || new Date().toLocaleDateString(),
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const oneMinute = 60 * 1000;

const orders = await Order.find({
  user: req.user.id,
  $or: [
    { status: { $ne: "Cancelled" } },
    {
      status: "Cancelled",
      cancelledAt: {
        $gte: new Date(Date.now() - oneMinute),
      },
    },
  ],
}).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCancelledOrders = async (req, res) => {
  try {
    const oneMinute =  60 * 1000;

    const orders = await Order.find({
      user: req.user.id,
      status: "Cancelled",
      cancelledAt: {
        $lt: new Date(Date.now() - oneMinute),
      },
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, statusStep } = req.body;

    const updateData = {
      status,
      statusStep,
    };

    // Agar order cancel hua hai to cancel time save karo
    if (status === "Cancelled") {
      updateData.cancelledAt = new Date();
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId, user: req.user.id },
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      orderId: req.params.orderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createOrder, getMyOrders,getCancelledOrders, updateOrderStatus, deleteOrder };
