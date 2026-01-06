const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartcontroller");

// ✅ Get all items for a user
router.get("/:userId", getCart);

// ✅ Add new item
router.post("/:userId", addToCart);

// ✅ Update quantity
router.put("/:itemId", updateCartItem);

// ✅ Remove one item
router.delete("/:itemId", removeFromCart);

// ✅ Clear all items for a user
router.delete("/clear/:userId", clearCart);

module.exports = router;
