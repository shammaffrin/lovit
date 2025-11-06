// src/api/wishlistapi.js
import axios from "axios";

// ✅ Use environment variable or fallback to localhost
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// ✅ Get all wishlist items for a specific user
export const getWishlist = (userId) => API.get(`/wishlist/${userId}`);

// ✅ Add a product to the wishlist
export const addToWishlist = (userId, product) =>
  API.post(`/wishlist/${userId}`, product);

// ✅ Remove a product from the wishlist
export const removeFromWishlist = (userId, itemId) =>
  API.delete(`/wishlist/${userId}/${itemId}`);
