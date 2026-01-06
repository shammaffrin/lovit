const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },

    // ✅ Variant details for color, size, and image
    variant: {
      color: { type: String, default: null },
      size: { type: String, default: null },
      image: { type: String, default: null }, // store variant image (if applicable)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
