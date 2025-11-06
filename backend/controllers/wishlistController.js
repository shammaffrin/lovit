const Wishlist = require("../models/Wishlist");

// ✅ Get all wishlist items for a user
exports.getWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const items = await Wishlist.find({ userId });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add an item to wishlist (no duplicates)
exports.addToWishlist = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, title, image, price, mrp } = req.body;

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(200).json({ message: "Already in wishlist" });
    }

    // Create new wishlist item
    const item = new Wishlist({ userId, productId, title, image, price, mrp });
    await item.save();

    res.status(201).json({ message: "Added to wishlist", item });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// ✅ Remove an item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const deleted = await Wishlist.findOneAndDelete({ _id: itemId, userId });
    if (!deleted) return res.status(404).json({ message: "Item not found" });
    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

