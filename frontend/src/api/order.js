import API from "./axios";

// Place new order
export const placeOrder = (orderData) => API.post("/orders", orderData);

// Get user orders
export const getOrders = (userId, token) =>
  API.get(`/orders/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Get all orders (Admin)
export const getAllOrders = (token) =>
  API.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });

// ✅ Update order status (Admin)
export const updateOrderStatus = (orderId, status, token) =>
  API.put(
    `/orders/${orderId}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
