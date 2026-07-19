const Cart = require("../models/Cart");
const Product = require("../models/Products");

// ===============================
// Add Product To Cart
// ===============================
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let cartItem = await Cart.findOne({
      user: req.user.id,
      product: productId,
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity);
      cartItem.total_price =
        cartItem.quantity * product.discount_price;

      await cartItem.save();

      return res.status(200).json({
        success: true,
        message: "Cart Updated",
        cartItem,
      });
    }

    cartItem = await Cart.create({
      user: req.user.id,
      product: productId,
      quantity: Number(quantity),
      total_price: product.discount_price * Number(quantity),
    });

    res.status(201).json({
      success: true,
      message: "Product Added To Cart",
      cartItem,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// Get Logged In User Cart
// ===============================
exports.getCart = async (req, res) => {

  try {

    const cart = await Cart.find({
      user: req.user.id,
    }).populate("product");

    res.status(200).json(cart);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ===============================
// Remove One Cart Item
// ===============================
exports.removeCartItem = async (req, res) => {

  try {

    await Cart.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Cart Item Removed",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ===============================
// Clear Full Cart
// ===============================
exports.clearCart = async (req, res) => {

  try {

    await Cart.deleteMany({
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      message: "Cart Cleared",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};