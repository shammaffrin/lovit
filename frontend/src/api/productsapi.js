import API from "./axios"; // pre-configured axios instance

/* =========================================================
   ✅ Fetch products with optional filters
   ========================================================= */
export const getProducts = ({
  categoryName = "",
  subcategoryName = "",
  search = "",
  minPrice,
  maxPrice,
} = {}) => {
  const params = {};

  if (categoryName) params.category = categoryName; // string
  if (subcategoryName) params.subcategory = subcategoryName;
  if (search) params.search = search;
  if (minPrice !== undefined) params.minPrice = minPrice;
  if (maxPrice !== undefined) params.maxPrice = maxPrice;

  return API.get("/products", { params });
};

/* =========================================================
   ✅ Get single product details
   ========================================================= */
export const getProductById = (id) => API.get(`/products/${id}`);

/* =========================================================
   ✅ Add new product (Admin only)
   ========================================================= */
export const addProduct = (data, config = {}) => API.post("/products", data, config);

/* =========================================================
   ✅ Update product (Admin only)
   ========================================================= */
export const updateProduct = (id, data, config = {}) => API.put(`/products/${id}`, data, config);

/* =========================================================
   ✅ Delete product (Admin only)
   ========================================================= */
export const deleteProduct = (id, config = {}) => API.delete(`/products/${id}`, config);


export const getRelatedProducts = (category, productId) =>
  API.get(`/products/related/${category}/${productId}`);