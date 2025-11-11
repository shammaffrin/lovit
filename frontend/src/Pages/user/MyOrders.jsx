import React, { useEffect, useState } from "react";
import { getOrders } from "../../api/order";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        if (!user || !token) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const res = await getOrders(user._id, token);
        let data = res.data || [];

        // ✅ Sort latest orders first
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
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
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow">
            <div className="flex justify-between mb-3 text-sm flex-wrap gap-2">
              <p><b>Order ID:</b> {order._id}</p>
              <p><b>Status:</b> {order.status}</p>
            </div>

            {order.items.map((item, idx) => {
              const product = item.productId || {};
              const image = product.mainImage || item.image || "https://placehold.co/100x100?text=No+Image";
              const title = product.title || item.title || "Unknown Product";

              return (
                <div key={idx} className="flex items-center gap-4 border-t py-3">
                  <img
                    src={image}
                    alt={title}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => (e.target.src = "https://placehold.co/100x100?text=No+Image")}
                  />
                  <div>
                    <p className="font-medium">{title}</p>
                    <p>₹{item.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>{item.color || "-"} / {item.size || "-"}</p>
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

export default MyOrders;
