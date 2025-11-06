const Order = require("../models/Order");
const Product = require("../models/Product");

// ✅ Place new order
exports.placeOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, totalAmount } = req.body;

    // Build detailed items
    const detailedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error("Product not found: " + item.productId);

        return {
          productId: product._id,
          title: product.title,
          price: item.price || product.price,
          color: item.color || "",
          size: item.size || "",
          image: item.image || product.mainImage || "",
          quantity: item.quantity || 1,
        };
      })
    );

    const order = new Order({
      userId,
      items: detailedItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: "Pending",
    });

    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    console.error("Failed to place order:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all orders for a specific user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Make sure user is requesting their own orders
    if (req.user.id !== userId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ userId })
      .populate("items.productId", "title mainImage") // fetch product info
      .exec();

    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to fetch user orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ✅ Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "title mainImage")
      .exec();

    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to fetch all orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
