const mongoose = require("mongoose");

// 🧩 Schema for individual sizes (e.g., S, M, L)
const SizeSchema = new mongoose.Schema({
  size: { type: String, required: true },   // e.g. "M"
  stock: { type: Number, required: true },  // e.g. 20
});

// 🧩 Schema for product variants (e.g., different colors)
const VariantSchema = new mongoose.Schema({
  color: { type: String, required: true },  // e.g. "Red"
  sizes: [SizeSchema],                      // available sizes under this color
  price: { type: Number, required: true },  // price for this variant
  images: [{ type: String, required: false, default: [] }]

});

// 🧩 Main product schema
const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },       // product name
    description: { type: String, trim: true },
    category: { type: String, required: true },
    subcategory: { type: String },
     mainImage: { type: String, required: true }, // ✅ Added
    variants: {
      type: [VariantSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one variant is required",
      },
    },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🧩 Export
module.exports = mongoose.model("Product", ProductSchema);
