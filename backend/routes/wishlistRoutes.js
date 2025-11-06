const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

// ✅ Get all wishlist items for a user
router.get("/:userId", getWishlist);

// ✅ Add an item to wishlist
router.post("/:userId", addToWishlist);

// ✅ Remove an item from wishlist (must include both userId + itemId)
router.delete("/:userId/:itemId", removeFromWishlist);

module.exports = router;
