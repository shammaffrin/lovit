// src/api/wishlistapi.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://lovit.vercel.app/api",
});

// ✅ Get all wishlist items for a specific user
export const getWishlist = (userId) => API.get(`/wishlist/${userId}`);

// ✅ Add a product to the wishlist
export const addToWishlist = (userId, product) =>
  API.post(`/wishlist/${userId}`, product);

// ✅ Remove a product from the wishlist
export const removeFromWishlist = (userId, itemId) =>
  API.delete(`/wishlist/${userId}/${itemId}`);
