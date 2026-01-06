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

// Update order status (Admin only)
router.put("/:id/status", verifyAdmin, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body; // new status from frontend

    // Use your controller or inline logic
    const Order = require("../models/Order"); // import model here if not in controller
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("❌ Failed to update status:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
