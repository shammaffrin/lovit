import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djwvjlkre/image/upload";
const CLOUDINARY_PRESET = "lovit_uploads";

const AProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories] = useState(["Men", "Women", "Kids", "Accessories"]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    variants: [{ color: "", price: "", sizes: [], images: [] }],
    isFeatured: false,
    isNewArrival: false,
  });

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      alert("🗑️ Product deleted successfully!");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("Failed to delete product.");
    }
  };

  // ✅ Start editing
  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setFormData({
      title: product.title || "",
      category: product.category || "",
      subcategory: product.subcategory || "",
      description: product.description || "",
      variants:
        product.variants?.length > 0
          ? product.variants.map((v) => ({
              color: v.color || "",
              price: v.price || "",
              sizes: Array.isArray(v.sizes) ? v.sizes : [],
              images: Array.isArray(v.images) ? v.images : [],
            }))
          : [{ color: "", price: "", sizes: [], images: [] }],
      isFeatured: !!product.isFeatured,
      isNewArrival: !!product.isNewArrival,
    });
  };

  // ✅ Handle basic input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle variant changes
  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index][field] = value;
      return { ...prev, variants: updated };
    });
  };

  // ✅ Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
    const result = await res.json();
    if (result.secure_url) return result.secure_url;
    throw new Error(result.error?.message || "Upload failed");
  };

  // ✅ Handle variant image upload
  const handleVariantImagesUpload = async (variantIndex, files) => {
    try {
      setLoading(true);
      const uploaded = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploaded.push(url);
      }
      const updated = [...formData.variants];
      updated[variantIndex].images = [
        ...updated[variantIndex].images,
        ...uploaded,
      ];
      setFormData((prev) => ({ ...prev, variants: updated }));
      alert("✅ Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Remove image from variant
  const removeVariantImage = (variantIndex, imageIndex) => {
    const updated = [...formData.variants];
    updated[variantIndex].images.splice(imageIndex, 1);
    setFormData((prev) => ({ ...prev, variants: updated }));
  };

  // ✅ Save updated product
  const handleSave = async (id) => {
    try {
      setLoading(true);
      const formattedVariants = formData.variants.map((v) => ({
        color: v.color,
        price: Number(v.price),
        sizes: Array.isArray(v.sizes)
          ? v.sizes.map((s) => ({
              size: s.size?.trim(),
              stock: Number(s.stock) || 0,
            }))
          : [],
        images: v.images,
      }));

      const updatedData = { ...formData, variants: formattedVariants };

      await API.put(`/products/${id}`, updatedData);
      alert("✅ Product updated successfully!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 font-[Poppins]">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">
        🛍️ Manage Products
      </h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border border-gray-200 text-sm min-w-[1000px]">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Category</th>
              <th className="px-3 py-2 text-left">Subcategory</th>
              <th className="px-3 py-2 text-left">Variants</th>
              <th className="px-3 py-2 text-center">Featured</th>
              <th className="px-3 py-2 text-center">New Arrival</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((p, index) => (
                <tr key={p._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-3 py-2">
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  {editingProduct === p._id ? (
                    <>
                      {/* 📝 Edit Mode */}
                      <td className="px-3 py-2">
                        <input
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="border px-2 py-1 w-full rounded"
                        />
                      </td>

                      <td className="px-3 py-2">
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="border px-2 py-1 w-full rounded"
                        >
                          <option value="">Select</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-3 py-2">
                        <input
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleChange}
                          className="border px-2 py-1 w-full rounded"
                        />
                      </td>

                      {/* ✅ Variant Editor */}
                      <td className="px-3 py-2">
                        {formData.variants.map((v, i) => (
                          <div key={i} className="border-b pb-2 mb-2">
                            <input
                              placeholder="Color"
                              value={v.color}
                              onChange={(e) =>
                                handleVariantChange(i, "color", e.target.value)
                              }
                              className="border px-2 py-1 w-full mb-1 rounded"
                            />
                            <input
                              type="number"
                              placeholder="Price"
                              value={v.price}
                              onChange={(e) =>
                                handleVariantChange(i, "price", e.target.value)
                              }
                              className="border px-2 py-1 w-full mb-2 rounded"
                            />

                            <label className="block text-xs font-medium mb-1">
                              Variant Images
                            </label>
                            <input
                              type="file"
                              multiple
                              onChange={(e) =>
                                handleVariantImagesUpload(i, e.target.files)
                              }
                              className="border p-1 w-full text-xs rounded"
                            />

                            <div className="flex flex-wrap gap-2 mt-2">
                              {v.images?.map((img, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={img}
                                    alt="variant"
                                    className="w-12 h-12 rounded object-cover border"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeVariantImage(i, idx)
                                    }
                                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-[3px] opacity-0 group-hover:opacity-100 transition"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </td>

                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          checked={formData.isFeatured}
                          onChange={handleChange}
                        />
                      </td>

                      <td className="px-3 py-2 text-center">
                        <input
                          type="checkbox"
                          name="isNewArrival"
                          checked={formData.isNewArrival}
                          onChange={handleChange}
                        />
                      </td>

                      <td className="px-3 py-2 whitespace-nowrap">
                        <button
                          onClick={() => handleSave(p._id)}
                          disabled={loading}
                          className="text-green-600 mr-2 hover:underline"
                        >
                          {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="text-gray-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* 👀 View Mode */}
                      <td className="px-3 py-2 font-semibold">{p.title}</td>
                      <td className="px-3 py-2">{p.category}</td>
                      <td className="px-3 py-2">{p.subcategory || "—"}</td>

                      {/* ✅ CLEAN VARIANT CARDS */}
                      <td className="p-2">
                        <div className="flex flex-wrap gap-3">
                          {p.variants?.map((variant, i) => (
                            <div
                              key={i}
                              className="flex flex-col items-center border rounded-lg p-2 w-[100px] bg-gray-50 shadow-sm"
                            >
                              <span className="font-semibold text-xs text-gray-700 mb-1 capitalize">
                                {variant.color}
                              </span>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {variant.images.slice(0, 3).map((img, idx) => (
                                  <img
                                    key={idx}
                                    src={img}
                                    alt="variant"
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600 mt-1">
                                ₹{variant.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="px-3 py-2 text-center">
                        {p.isFeatured ? "✅" : "❌"}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {p.isNewArrival ? "🆕" : "—"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(p)}
                          className="text-blue-500 mr-2 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AProducts;
