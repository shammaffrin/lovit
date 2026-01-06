import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const AOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderIds, setExpandedOrderIds] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const res = await API.get("/orders", config);
      const data = Array.isArray(res.data) ? res.data : res.data.orders || [];
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // newest first
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      await API.put(`/orders/${orderId}/status`, { status: newStatus }, config);
      setOrders((prev) =>
        prev.map(o => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status");
    }
  };

  const filteredOrders = filterStatus
    ? orders.filter(order => order.status === filterStatus)
    : orders;

  if (loading) return <p className="text-center py-10">Loading orders...</p>;
  if (!filteredOrders.length) return <p className="text-center py-10">No orders found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Orders</h2>

      {/* Filter */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
          <label className="mr-2 font-medium">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">All</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchOrders}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Refresh
        </button>
      </div>

      {/* Orders */}
      {filteredOrders.map(order => {
        const isExpanded = expandedOrderIds.includes(order._id);
        return (
          <div key={order._id} className="border rounded-lg p-4 shadow space-y-2">
            {/* Summary */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="text-sm">
                <p><b>Order ID:</b> {order._id}</p>
                <p>
  <b>SKU:</b>{" "}
  {order.items && order.items.length > 0
    ? order.items.map((i) => i.sku).join(", ")
    : "N/A"}
</p>

                <p><b>User:</b> {order.userId?.name || "Unknown"}</p>
                <p><b>Status:</b> {order.status}</p>
                <p><b>Total:</b> ₹{order.totalAmount}</p>
              </div>
              <button
                onClick={() => toggleDetails(order._id)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isExpanded ? "Hide Details" : "View Details"}
              </button>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="text-sm text-gray-700 border-t pt-2 space-y-2">
                {/* Shipping Address */}
                {order.shippingAddress && (
                  <div>
                    <p><b>Shipping Address:</b></p>
                    <p>{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                    </p>
                  </div>
                )}

                {/* Items */}
                <div>
                  <p><b>Items:</b></p>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center border-t pt-2">
                      <img
                        src={
                          item.mainImage?.startsWith("http")
                            ? item.mainImage
                            : item.productId?.mainImage?.startsWith("http")
                            ? item.productId.mainImage
                            : "https://placehold.co/100x100?text=No+Image"
                        }
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <p>{item.title}</p>
                         <p>SKU: <span className="font-mono text-blue-700">{item.sku || "N/A"}</span></p>
                        <p>₹{item.price} × {item.quantity || 1}</p>
                        <p>{item.color || "Default"} / {item.size || "N/A"}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment & Method */}
                {order.paymentMethod && <p><b>Payment Method:</b> {order.paymentMethod}</p>}

                {/* Status Update */}
                <div className="mt-2">
                  <label className="mr-2 font-medium">Update Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border px-2 py-1 rounded text-sm"
                  >
                    {STATUS_OPTIONS.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AOrders;
