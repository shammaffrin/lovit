const Order = require("../models/Order");
const Product = require("../models/Product");

exports.placeOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided for order" });
    }

    const detailedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found: " + item.productId });
      }

      // ✅ Find variant by color (case-insensitive)
      const variant = product.variants.find(v =>
        item.color &&
        v.color &&
        v.color.toLowerCase() === item.color.toLowerCase()
      );

      if (!variant) {
        return res.status(404).json({ message: `Variant not found for color: ${item.color}` });
      }

      // ✅ Find size object
      const sizeObj = variant.sizes.find(
        s => s.size.toLowerCase() === (item.size || "").toLowerCase()
      );

      if (!sizeObj) {
        return res.status(404).json({ message: `Size not found for ${item.size}` });
      }

      // ✅ Check stock availability
      if (sizeObj.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title} (${variant.color}, size ${sizeObj.size}). Available: ${sizeObj.stock}`,
        });
      }

      // ✅ Deduct stock
      sizeObj.stock -= item.quantity;

      // ✅ Save updated product stock
      await product.save();

      // ✅ Push item details to order
      detailedItems.push({
        productId: product._id,
        title: product.title,
        price: item.price || variant.price || product.price,
        color: variant.color,
        size: sizeObj.size,
        image: variant.images?.[0] || product.mainImage,
        quantity: item.quantity,
        sku: product.sku,
      });
    }

    // ✅ Create and save order
    const order = new Order({
      userId,
      items: detailedItems,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: "Pending",
    });

    await order.save();

    res.status(201).json({
      message: "✅ Order placed successfully and stock updated",
      order,
    });
  } catch (err) {
    console.error("❌ Failed to place order:", err);
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
