const Wallet = require("../models/Wallet");

// ===============================
// Get Wallet
// ===============================
const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user.id,
        balance: 0,
        transactions: [],
      });
    }

    res.json(wallet);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// Add Money
// ===============================
const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid Amount",
      });
    }

    let wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      wallet = await Wallet.create({
        user: req.user.id,
        balance: 0,
        transactions: [],
      });
    }

    wallet.balance += Number(amount);

    wallet.transactions.unshift({
      amount: Number(amount),
      type: "Credit",
      status: "Success",
    });

    await wallet.save();

    res.json(wallet);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// Deduct Money
// ===============================
const deductMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    const wallet = await Wallet.findOne({
      user: req.user.id,
    });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet Not Found",
      });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({
        message: "Insufficient Balance",
      });
    }

    wallet.balance -= Number(amount);

    wallet.transactions.unshift({
      amount: Number(amount),
      type: "Debit",
      status: "Success",
    });

    await wallet.save();

    res.json(wallet);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  getWallet,
  addMoney,
  deductMoney,
};