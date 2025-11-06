import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const AOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/details/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("❌ Error fetching order details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="text-center mt-10">Loading order details...</p>;
  if (!order) return <p className="text-center mt-10 text-red-500">Order not found.</p>;

  return (
    <div className="p-6 font-[Poppins] max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to Orders
      </button>

      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div className="border rounded-lg p-5 bg-white shadow-sm">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p>
          <strong>User:</strong>{" "}
          {order.userId?.name || "Unknown"} ({order.userId?.email || "N/A"})
        </p>
        <p><strong>Payment:</strong> {order.paymentMethod?.toUpperCase()}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">📦 Shipping Address</h3>
          <p>{order.shippingAddress?.name || "N/A"}</p>
          <p>{order.shippingAddress?.address || ""}</p>
          <p>
            {[order.shippingAddress?.city, order.shippingAddress?.state, order.shippingAddress?.zipCode]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">🛍️ Ordered Items</h3>
         {Array.isArray(order.items) && order.items.length > 0 ? (
  order.items.map((item, i) => {
    const product = item.productId || {};
    return (
      <div
        key={i}
        className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src={item.image || product.image || "/placeholder.jpg"}
            alt={product.title || item.title}
            className="w-28 h-28 object-cover rounded-md border"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">
              {product.title || item.title}
            </h3>
            <p className="text-gray-600 text-sm mb-1">
              <strong>Category:</strong> {product.category || "N/A"}
            </p>
            {item.color && (
              <p className="text-gray-600 text-sm">
                <strong>Color:</strong> {item.color}
              </p>
            )}
            {item.size && (
              <p className="text-gray-600 text-sm">
                <strong>Size:</strong> {item.size}
              </p>
            )}
            <p className="text-gray-600 text-sm">
              <strong>Qty:</strong> {item.quantity}
            </p>
            <p className="text-gray-600 text-sm">
              <strong>Price:</strong> ₹{item.price}
            </p>
            <p className="text-gray-900 font-medium mt-2">
              Subtotal: ₹{item.price * item.quantity}
            </p>
            {product.description && (
              <p className="text-gray-500 text-sm mt-2 italic">
                {product.description.slice(0, 100)}...
              </p>
            )}
          </div>
        </div>
      </div>
    );
  })
) : (
  <p className="text-gray-500 italic">No items found for this order.</p>
)}

        </div>
      </div>
    </div>
  );
};

export default AOrderDetails;
