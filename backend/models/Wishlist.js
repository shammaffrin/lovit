const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

    // Product details snapshot
    title: String,
    image: String,
    price: Number,
    mrp: Number,

    // Variant details
    color: String,
    size: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
