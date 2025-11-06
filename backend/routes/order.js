const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
} = require("../controllers/orderController");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// Place a new order
router.post("/", verifyToken, placeOrder);

// Get orders for a user
router.get("/user/:userId", verifyToken, getUserOrders);

// Get all orders (Admin)
router.get("/", verifyAdmin, getAllOrders);

module.exports = router;
