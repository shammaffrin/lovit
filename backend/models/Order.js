const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        title: String,
        mainImage: String,  // optional backup image snapshot
        price: Number,
        quantity: Number,
        color: String,
        size: String,   
        sku: String, // ✅ store product SKU snapshot
      },
    ],
    totalAmount: Number,
    paymentMethod: String,

    shippingAddress: {
      name: String,
      address: String,
      city: String,
      state: String,
      zipCode: String,
    },

    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
