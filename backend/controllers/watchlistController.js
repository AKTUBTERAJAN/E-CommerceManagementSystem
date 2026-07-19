const Watchlist = require("../models/Watchlist");
const Product = require("../models/Products");

// ==========================
// Get Watchlist
// ==========================
const getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({
      user: req.user.id,
    }).populate("product");

    const data = watchlist.map((item) => ({
      watchlistId: item._id,
      ...item.product.toObject(),
    }));

    res.json(data);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// Add Product
// ==========================
const addToWatchlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    const already = await Watchlist.findOne({
      user: req.user.id,
      product: productId,
    });

    if (already) {
      return res.json({
        message: "Already Added",
      });
    }

    await Watchlist.create({
      user: req.user.id,
      product: productId,
    });

    res.json({
      message: "Product Added Successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================
// Remove Product
// ==========================
const removeWatchlist = async (req, res) => {
  try {

    await Watchlist.findByIdAndDelete(req.params.id);

    res.json({
      message: "Removed Successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeWatchlist,
};