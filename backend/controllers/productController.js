const Product = require("../models/Product");

// ✅ Add a new product
exports.addProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all products (filters: category, subcategory, price range, search)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, subcategory, minPrice, maxPrice, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Clean up empty strings
    if (updateData.category?.trim() === "") delete updateData.category;
    if (updateData.subcategory?.trim() === "") delete updateData.subcategory;

    // ✅ Sanitize variants and sizes before update
    if (Array.isArray(updateData.variants)) {
      updateData.variants = updateData.variants
        .filter((v) => v.color && v.price)
        .map((v) => ({
          color: v.color,
          price: Number(v.price),
          sizes: Array.isArray(v.sizes)
            ? v.sizes
                .filter((s) => s.size)
                .map((s) => ({
                  size: s.size.trim(),
                  stock: Number(s.stock) || 0,
                }))
            : [],
          images: Array.isArray(v.images) ? v.images : [],
        }));
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res
      .status(200)
      .json({ message: "✅ Product updated successfully", product: updated });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(400).json({
      message: "Validation failed",
      error: err.message,
      details: err.errors || err,
    });
  }
};

// ✅ Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get related products (same category)
exports.getRelatedProducts = async (req, res) => {
  try {
    const { category, productId } = req.params;

    const relatedProducts = await Product.find({
      category,
      _id: { $ne: productId },
    })
      .limit(6)
      .sort({ createdAt: -1 });

    res.status(200).json(relatedProducts);
  } catch (err) {
    console.error("❌ Error fetching related products:", err);
    res.status(500).json({ message: "Error fetching related products" });
  }
};
