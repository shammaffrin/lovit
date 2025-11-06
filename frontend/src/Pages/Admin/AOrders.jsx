import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const AOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ✅ Include JWT token for admin authentication
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};

        const res = await API.get("/orders", config);

        // ✅ Handle different response formats
        const data = Array.isArray(res.data)
          ? res.data
          : res.data.orders || [];
        setOrders(data);
      } catch (err) {
        console.error("❌ Failed to fetch admin orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center py-10">Loading orders...</p>;
  if (!orders.length) return <p className="text-center py-10">No orders yet.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">All Orders (Admin)</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow">
            {/* Header */}
            <div className="flex justify-between mb-3 flex-wrap gap-2 text-sm">
              <p><b>Order ID:</b> {order._id}</p>
              <p><b>Status:</b> {order.status}</p>
              <p><b>User:</b> {order.userId?.name || "Unknown"}</p>
            </div>

            {/* Order items */}
            {Array.isArray(order.items) &&
              order.items.map((item, idx) => {
                // ✅ Robust image logic
                const image =
                  item.image && item.image.startsWith("http")
                    ? item.image
                    : item.productId?.mainImage?.startsWith("http")
                    ? item.productId.mainImage
                    : "https://placehold.co/100x100?text=No+Image";

                const title = item.productId?.title || item.title || "Unknown Product";

                return (
                  <div key={idx} className="flex items-center gap-4 border-t py-3">
                    <img
                      src={image}
                      alt={title}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) =>
                        (e.target.src =
                          "https://placehold.co/100x100?text=No+Image")
                      }
                    />
                    <div>
                      <p className="font-medium">{title}</p>
                      <p>₹{item.price}</p>
                      <p>{item.color || "Default"} / {item.size || "N/A"}</p>
                    </div>
                  </div>
                );
              })}

            <p className="text-right font-semibold mt-2">
              Total: ₹{order.totalAmount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AOrders;
