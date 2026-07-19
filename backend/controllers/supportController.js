const SupportMessage = require("../models/SupportMessage");

const createSupportMessage = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const supportMessage = await SupportMessage.create({
      name,
      email,
      mobile,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully",
      supportMessage,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getSupportMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find({}).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createSupportMessage, getSupportMessages };
