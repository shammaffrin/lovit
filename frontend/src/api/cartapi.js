import API from "./axios";

export const getCart = (userId) => API.get(`/cart/${userId}`);

export const addToCart = (userId, product) => API.post(`/cart/${userId}`, product);

export const updateCartItem = (itemId, qty) =>
  API.put(`/cart/${itemId}`, { qty });

export const removeFromCart = (itemId) => API.delete(`/cart/${itemId}`);

export const clearUserCart = (userId) => API.delete(`/cart/clear/${userId}`);
