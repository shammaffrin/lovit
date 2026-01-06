import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djwvjlkre/image/upload";
const CLOUDINARY_PRESET = "lovit_uploads";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    description: "",
    mainImage: "",
    variants: [{ color: "", price: "", sizes: [], images: [] }],
    isFeatured: false,
    isNewArrival: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/products");
        const products = res.data || [];
        setAllProducts(products);

        const uniqueCategories = [
          ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
        ];
        setCategories(uniqueCategories);

        const product = products.find((p) => p._id === id);
        if (!product) {
          alert("Product not found");
          navigate("/admin/products");
          return;
        }

        setFormData({
          title: product.title || "",
          category: product.category?.name || "",
          subcategory: product.subcategory || "",
          description: product.description || "",
          mainImage: product.mainImage || "",
          variants: product.variants?.length
            ? product.variants.map((v) => ({
                 color: v.color || "Default",
                price: v.price || "",
                sizes: Array.isArray(v.sizes) ? v.sizes : [],
                images: Array.isArray(v.images) ? v.images : [],
              }))
            : [{ color: "", price: "", sizes: [], images: [] }],
          isFeatured: !!product.isFeatured,
          isNewArrival: !!product.isNewArrival,
        });

        const subcats = products
          .filter((p) => p.category?.name === product.category?.name && p.subcategory)
          .map((p) => p.subcategory);
        setSubcategories([...new Set(subcats)]);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
        alert("Failed to load product");
      }
    };

    fetchProducts();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (name === "category") {
      setNewCategory(value);
      setFormData((prev) => ({ ...prev, category: value }));
      // dynamically update subcategories for selected category
      const subcats = allProducts
        .filter((p) => p.category?.name === value && p.subcategory)
        .map((p) => p.subcategory);
      setSubcategories([...new Set(subcats)]);
    }

    if (name === "subcategory") {
      setNewSubcategory(value);
      setFormData((prev) => ({ ...prev, subcategory: value }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, variants: updated }));
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_PRESET);
    const res = await fetch(CLOUDINARY_URL, { method: "POST", body: data });
    const result = await res.json();
    if (result.secure_url) return result.secure_url;
    throw new Error(result.error?.message || "Upload failed");
  };

  const handleMainImageUpload = async (file) => {
    try {
      setLoading(true);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, mainImage: url }));
      alert("✅ Main image uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Main image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantImagesUpload = async (variantIndex, files) => {
    try {
      setLoading(true);
      const uploaded = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploaded.push(url);
      }
      const updated = [...formData.variants];
      updated[variantIndex].images = [...updated[variantIndex].images, ...uploaded];
      setFormData((prev) => ({ ...prev, variants: updated }));
      alert("✅ Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const updated = [...formData.variants];
    updated[variantIndex].images.splice(imageIndex, 1);
    setFormData((prev) => ({ ...prev, variants: updated }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formattedVariants = formData.variants.map((v) => ({
         color: v.color || "Default",
        price: Number(v.price),
        sizes: Array.isArray(v.sizes)
          ? v.sizes.map((s) => ({ size: s.size?.trim(), stock: Number(s.stock) || 0 }))
          : [],
        images: v.images,
      }));

      const updatedData = { ...formData, variants: formattedVariants };
      await API.put(`/products/${id}`, updatedData);
      alert("✅ Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 font-[Poppins]">
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left">Edit Product</h1>

      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-4">
        {/* Main Image */}
        <label className="block mb-2 font-medium">Main Image</label>
        {formData.mainImage && (
          <img
            src={formData.mainImage}
            alt="Main"
            className="w-32 h-32 object-cover rounded mb-2 border"
          />
        )}
        <input
          type="file"
          onChange={(e) => handleMainImageUpload(e.target.files[0])}
          className="border p-1 w-full text-xs rounded mb-4"
        />

        {/* Title */}
        <label className="block mb-2 font-medium">Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded mb-4"
        />

        {/* Category */}
        <label className="block mb-2 font-medium">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded mb-2"
        >
          <option value="">Select</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Or type new category..."
          value={newCategory}
          onChange={handleChange}
          name="category"
          className="border px-2 py-1 w-full rounded mb-4"
        />

        {/* Subcategory */}
        <label className="block mb-2 font-medium">Subcategory</label>
        <select
          name="subcategory"
          value={formData.subcategory}
          onChange={handleChange}
          className="border px-2 py-1 w-full rounded mb-2"
        >
          <option value="">Select</option>
          {subcategories.map((sub, i) => (
            <option key={i} value={sub}>
              {sub}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Or type new subcategory..."
          value={newSubcategory}
          onChange={handleChange}
          name="subcategory"
          className="border px-2 py-1 w-full rounded mb-4"
        />

        {/* Variants */}
        {formData.variants.map((v, i) => (
          <div key={i} className="border p-3 rounded mb-4">
            <input
              placeholder="Color"
              value={v.color}
              onChange={(e) => handleVariantChange(i, "color", e.target.value)}
              className="border px-2 py-1 w-full mb-2 rounded"
            />
            <input
              type="number"
              placeholder="Price"
              value={v.price}
              onChange={(e) => handleVariantChange(i, "price", e.target.value)}
              className="border px-2 py-1 w-full mb-2 rounded"
            />

            {/* Sizes */}
            <div className="mb-3">
              {v.sizes?.map((s, si) => (
                <div key={si} className="flex gap-2 mb-2">
                  <input
                    placeholder="Size"
                    value={s.size}
                    onChange={(e) => {
                      const updated = [...formData.variants];
                      updated[i].sizes[si].size = e.target.value;
                      setFormData({ ...formData, variants: updated });
                    }}
                    className="border px-2 py-1 rounded w-1/2"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={s.stock}
                    onChange={(e) => {
                      const updated = [...formData.variants];
                      updated[i].sizes[si].stock = e.target.value;
                      setFormData({ ...formData, variants: updated });
                    }}
                    className="border px-2 py-1 rounded w-1/2"
                  />
                </div>
              ))}
            </div>

            {/* Variant Images */}
            <input
              type="file"
              multiple
              onChange={(e) => handleVariantImagesUpload(i, e.target.files)}
              className="border p-1 w-full text-xs rounded mb-2"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {v.images?.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt="variant" className="w-12 h-12 rounded object-cover border" />
                  <button
                    type="button"
                    onClick={() => removeVariantImage(i, idx)}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-[3px] opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Featured & New Arrival */}
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            Featured
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival}
              onChange={handleChange}
            />
            New Arrival
          </label>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
};

export default EditProduct;
