const mongoose = require("mongoose");

// Schema for individual sizes
const SizeSchema = new mongoose.Schema({
  size: { type: String, required: [true, "Size name is required"] },
  stock: { type: Number, required: [true, "Stock count is required"], min: 0 },
});

// Schema for variants
const VariantSchema = new mongoose.Schema({
  color: { type: String, required: false },
  sizes: {
    type: [SizeSchema],
    validate: {
      validator: (arr) => arr.length > 0,
      message: "At least one size is required per variant",
    },
  },
  price: { type: Number, required: [true, "Price is required"], min: 0 },
  images: [{ type: String, default: [] }],
});

// Main Product Schema
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Product title is required"] },
    description: { type: String, trim: true },

    // ✅ category is now just a string, no separate model
    category: { type: String, required: [true, "Category is required"] },

    subcategory: { type: String, required: false },

    mainImage: { type: String, required: [true, "Main image is required"] },

    variants: {
      type: [VariantSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one variant is required",
      },
    },

    sku: {
      type: String,
      unique: true,
      default: function () {
        return `SKU-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      },
    },

    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);
