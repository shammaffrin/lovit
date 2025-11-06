const Cart = require("../models/Cart");

// ✅ Get all cart items for a user
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Cart.find({ userId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, title, price, quantity, variant } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "Missing userId or productId" });
    }

    // ✅ Normalize variant safely
    const normalizedVariant = {
      color: variant?.color?.trim()?.toLowerCase() || "default",
      size: variant?.size?.trim()?.toUpperCase() || "default",
      image: variant?.image || null,
    };

    // ✅ Check existing
    const existingItem = await Cart.findOne({
      userId,
      productId,
      "variant.color": normalizedVariant.color,
      "variant.size": normalizedVariant.size,
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.status(200).json({
        message: "Quantity updated in cart",
        item: existingItem,
      });
    }

    // ✅ Add new
    const newItem = new Cart({
      userId,
      productId,
      title,
      price,
      quantity: quantity || 1,
      variant: normalizedVariant,
    });

    await newItem.save();
    res.status(201).json({ message: "Added to cart", item: newItem });
  } catch (err) {
    console.error("❌ Add to cart error:", err);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Update item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { qty } = req.body;

    const item = await Cart.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = qty;
    await item.save();

    res.status(200).json({ message: "Quantity updated", item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const deleted = await Cart.findByIdAndDelete(itemId);
    if (!deleted) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Clear all items for a user
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    await Cart.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
