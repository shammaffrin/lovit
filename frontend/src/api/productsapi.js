// src/api/productsapi.js
import API from "./axios"; // ✅ use configured axios instance

// ✅ Fetch products (optionally filtered by category/subcategory)
export const getProducts = (category, subcategory) => {
  const params = {};
  if (category) params.category = category;
  if (subcategory) params.subcategory = subcategory;
  return API.get("/products", { params }); // ✅ plural, matches backend
};

// ✅ Get single product details
export const getProductById = (id) => API.get(`/products/${id}`);

// ✅ Add new product (Admin only)
export const addProduct = (data) => API.post("/products", data);

// ✅ Update product (Admin only)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);

// ✅ Delete product (Admin only)
export const deleteProduct = (id) => API.delete(`/products/${id}`);
