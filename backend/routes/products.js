const express = require("express");
const Product = require("../models/Product");
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
      category, // now a string
      subcategory,
      mainImage,
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
      color: v.color || null,
      price: v.price,
      sizes: v.sizes?.length ? v.sizes : [],
      images: v.images?.length ? v.images : [],
    }));

    const newProduct = new Product({
      title,
      description,
      category, // string now
      subcategory,
      mainImage,
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
   ✅ GET ALL PRODUCTS (optional filters)
   ========================================================= */
router.get("/", async (req, res) => {
  try {
    const { category, subcategory, search, minPrice, maxPrice } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = { $regex: subcategory, $options: "i" };
    if (search) filter.title = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter["variants.price"] = {};
      if (minPrice) filter["variants.price"].$gte = Number(minPrice);
      if (maxPrice) filter["variants.price"].$lte = Number(maxPrice);
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/related/:category/:productId", async (req, res) => {
  try {
    const { category, productId } = req.params;

    // Find products from the same category but exclude the current one
    const relatedProducts = await Product.find({
      category,
      _id: { $ne: productId },
    })
      .limit(6) // limit to 6 products
      .sort({ createdAt: -1 });

    res.status(200).json(relatedProducts);
  } catch (err) {
    console.error("❌ Error fetching related products:", err);
    res.status(500).json({ message: "Error fetching related products" });
  }
});

/* =========================================================
   ✅ GET SINGLE PRODUCT
   ========================================================= */
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    console.error("❌ Error fetching product:", err);
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   ✅ UPDATE PRODUCT (Admin)
   ========================================================= */

router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // 🧹 Clean empty strings
    if (updateData.category?.trim() === "") delete updateData.category;
    if (updateData.subcategory?.trim() === "") delete updateData.subcategory;

    // 🧠 Validate & sanitize variants before saving
    if (Array.isArray(updateData.variants)) {
      updateData.variants = updateData.variants
        .filter((v) => v.color && v.price) // remove incomplete variants
        .map((v) => ({
          color: v.color.trim(),
          price: Number(v.price),
          sizes: Array.isArray(v.sizes)
            ? v.sizes
                .filter((s) => s.size) // remove empty sizes
                .map((s) => ({
                  size: s.size.trim(),
                  stock: Number(s.stock) || 0,
                }))
            : [],
          images: Array.isArray(v.images) ? v.images : [],
        }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "✅ Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(400).json({
      message: "Validation failed",
      error: err.message,
      details: err.errors || err,
    });
  }
});


/* =========================================================
   ✅ DELETE PRODUCT (Admin)
   ========================================================= */
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "🗑️ Product deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting product:", err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
