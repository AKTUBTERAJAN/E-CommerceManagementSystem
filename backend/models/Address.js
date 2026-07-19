const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    // Login user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Full Name
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // Mobile Number
    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    // House / Flat Number
    house: {
      type: String,
      required: true,
      trim: true,
    },

    // Area / Street
    area: {
      type: String,
      required: true,
      trim: true,
    },

    // Landmark
    landmark: {
      type: String,
      default: "",
      trim: true,
    },

    // City
    city: {
      type: String,
      required: true,
      trim: true,
    },

    // State
    state: {
      type: String,
      required: true,
      trim: true,
    },

    // Pincode
    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    // Country
    country: {
      type: String,
      default: "India",
      trim: true,
    },

    // Default Address
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Address", addressSchema);