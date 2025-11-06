const express = require("express");
const Product = require("../models/Product.js");
const { verifyAdmin } = require("../middleware/auth");

const router = express.Router();

/* =========================================================
   ✅ CREATE PRODUCT (Admin)
   ========================================================= */
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      mainImage, // ✅ add this
      variants = [],
      isFeatured = false,
      isNewArrival = false,
    } = req.body;

    if (!title || !category || variants.length === 0) {
      return res.status(400).json({
        message: "Please provide title, category, and at least one variant.",
      });
    }

    const formattedVariants = variants.map((v) => ({
      color: v.color,
      price: v.price,
      sizes: v.sizes?.length ? v.sizes : [],
      images: v.images?.length ? v.images : [], // Cloudinary URLs here
    }));

    const newProduct = new Product({
      title,
      description,
      category,
      subcategory,
      mainImage, // ✅ Save main Cloudinary image
      variants: formattedVariants,
      isFeatured,
      isNewArrival,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: "✅ Product added successfully",
      product: savedProduct,
    });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ message: err.message });
  }
});


/* =========================================================
   ✅ GET ALL PRODUCTS
   ========================================================= */
router.get("/", async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({
      message: "❌ Error fetching products",
      error: err.message,
    });
  }
});


/* =========================================================
   ✅ GET SINGLE PRODUCT
   ========================================================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({
      message: "❌ Error fetching product",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ UPDATE PRODUCT (Admin)
   ========================================================= */
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updateData = req.body;

    if (updateData.variants) {
      updateData.variants = updateData.variants.map((v) => ({
        color: v.color,
        price: v.price,
        sizes: v.sizes?.length ? v.sizes : [],
        images: v.images?.length ? v.images : [],
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "✅ Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      message: "❌ Error updating product",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ DELETE PRODUCT (Admin)
   ========================================================= */
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "❌ Error deleting product",
      error: err.message,
    });
  }
});

module.exports = router;
