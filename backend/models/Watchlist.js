const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ek hi user ek hi product ko sirf ek baar add kar sake
watchlistSchema.index(
  { user: 1, product: 1 },
  { unique: true }
);

module.exports = mongoose.model("Watchlist", watchlistSchema);