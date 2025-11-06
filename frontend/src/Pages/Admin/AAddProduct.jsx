import React, { useState } from "react";
import API from "../../api/axios";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djwvjlkre/image/upload";
const CLOUDINARY_PRESET = "lovit_uploads";

const AAddProduct = () => {
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    mainImage: "",
  });

  const [categories, setCategories] = useState([
    "Men",
    "Women",
    "Kids",
    "Accessories",
  ]);

  const [sizesList, setSizesList] = useState(["S", "M", "L", "XL"]);

  const [variants, setVariants] = useState([
    { color: "", price: "", images: [], sizes: [{ size: "", stock: "" }] },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ----------------------------
  // HANDLERS
  // ----------------------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleVariantChange = (i, e) => {
    const updated = [...variants];
    updated[i][e.target.name] = e.target.value;
    setVariants(updated);
  };

  const handleSizeChange = (variantIndex, sizeIndex, e) => {
    const updated = [...variants];
    updated[variantIndex].sizes[sizeIndex][e.target.name] = e.target.value;
    setVariants(updated);
  };

  const addSize = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].sizes.push({ size: "", stock: "" });
    setVariants(updated);
  };

  const removeSize = (variantIndex, sizeIndex) => {
    const updated = [...variants];
    updated[variantIndex].sizes.splice(sizeIndex, 1);
    setVariants(updated);
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      { color: "", price: "", images: [], sizes: [{ size: "", stock: "" }] },
    ]);

  const removeVariant = (i) =>
    setVariants(variants.filter((_, idx) => idx !== i));

  // ----------------------------
  // CLOUDINARY UPLOAD
  // ----------------------------
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
      setMessage("Uploading main image...");
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, mainImage: url }));
      setMessage("✅ Main image uploaded!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Main image upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantImagesUpload = async (variantIndex, files) => {
    const updated = [...variants];
    setLoading(true);
    setMessage("Uploading variant images...");

    try {
      const uploaded = [];
      for (const file of files) {
        const url = await uploadToCloudinary(file);
        uploaded.push(url);
      }

      updated[variantIndex].images = [
        ...(updated[variantIndex].images || []),
        ...uploaded,
      ];

      setVariants(updated);
      setMessage("✅ Variant images uploaded successfully!");
    } catch (err) {
      console.error("Image upload error:", err);
      setMessage("❌ Failed to upload variant images.");
    } finally {
      setLoading(false);
    }
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const updated = [...variants];
    updated[variantIndex].images.splice(imageIndex, 1);
    setVariants(updated);
  };

  // ----------------------------
  // CATEGORY / SIZE ADD
  // ----------------------------
  const addNewCategory = () => {
    const newCat = prompt("Enter new category name:");
    if (newCat && !categories.includes(newCat)) {
      setCategories([...categories, newCat]);
      setFormData({ ...formData, category: newCat });
    }
  };

  const addNewSize = () => {
    const newSize = prompt("Enter new size (e.g., XXL):");
    if (newSize && !sizesList.includes(newSize)) {
      setSizesList([...sizesList, newSize]);
    }
  };

  // ----------------------------
  // SUBMIT PRODUCT
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const cleanedVariants = variants.map((v) => ({
        ...v,
        price: Number(v.price),
        sizes: v.sizes.map((s) => ({
          size: s.size,
          stock: Number(s.stock),
        })),
      }));

      const productData = { ...formData, variants: cleanedVariants };

      const res = await API.post("/products", productData, config);
      setMessage("✅ Product added successfully!");
      console.log("Response:", res.data);

      // reset
      setFormData({
        category: "",
        subcategory: "",
        title: "",
        description: "",
        mainImage: "",
      });
      setVariants([
        { color: "", price: "", images: [], sizes: [{ size: "", stock: "" }] },
      ]);
    } catch (err) {
      console.error("❌ Error adding product:", err.response?.data || err);
      setMessage("❌ Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="font-[Poppins] px-3 sm:px-6 py-6 sm:py-10 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Add Product
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* CATEGORY */}
          <div className="flex gap-2">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            >
              <option value="">Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addNewCategory}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 transition"
            >
              + Add
            </button>
          </div>

          <input
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            placeholder="Subcategory"
            className="border p-3 rounded w-full"
          />

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="border p-3 rounded w-full"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-3 rounded w-full"
          />

          {/* MAIN IMAGE */}
          <div>
            <label className="font-medium text-gray-700">
              Main Product Image:
            </label>
            <input
              type="file"
              onChange={(e) => handleMainImageUpload(e.target.files[0])}
              className="border p-2 w-full rounded mt-2"
            />
            {formData.mainImage && (
              <img
                src={formData.mainImage}
                alt="main"
                className="w-32 h-32 mt-3 rounded-lg object-cover border"
              />
            )}
          </div>

          {/* VARIANTS */}
          {variants.map((variant, i) => (
            <div
              key={i}
              className="border-2 border-blue-100 rounded-xl p-4 bg-blue-50/30 shadow-sm flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="color"
                  value={variant.color}
                  onChange={(e) => handleVariantChange(i, e)}
                  placeholder="Color"
                  className="border p-2 rounded"
                />
                <input
                  name="price"
                  type="number"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(i, e)}
                  placeholder="Price"
                  className="border p-2 rounded"
                />
              </div>

              {/* VARIANT IMAGES */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Variant Images:
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleVariantImagesUpload(i, e.target.files)
                  }
                  className="border p-2 w-full rounded mt-1"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {variant.images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt="preview"
                        className="w-16 h-16 rounded-lg object-cover border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantImage(i, idx)}
                        className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SIZES */}
              <div>
                <h4 className="text-sm font-semibold text-gray-800 mt-2">
                  Sizes
                </h4>
                {variant.sizes.map((sizeObj, si) => (
                  <div key={si} className="flex gap-2 mb-2">
                    <select
                      name="size"
                      value={sizeObj.size}
                      onChange={(e) => handleSizeChange(i, si, e)}
                      className="border p-2 rounded w-1/2"
                    >
                      <option value="">Select Size</option>
                      {sizesList.map((s, idx) => (
                        <option key={idx} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      name="stock"
                      type="number"
                      value={sizeObj.stock}
                      onChange={(e) => handleSizeChange(i, si, e)}
                      placeholder="Stock"
                      className="border p-2 rounded w-1/2"
                    />
                    {variant.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSize(i, si)}
                        className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        x
                      </button>
                    )}
                  </div>
                ))}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => addSize(i)}
                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600 transition"
                  >
                    + Add Size
                  </button>
                  <button
                    type="button"
                    onClick={addNewSize}
                    className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600 transition"
                  >
                    + New Size Option
                  </button>
                </div>
              </div>

              {variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="bg-red-500 text-white text-xs px-3 py-1 rounded self-end hover:bg-red-600 transition"
                >
                  Remove Variant
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            + Add Another Color Variant
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>

          {message && (
            <p
              className={`text-center mt-3 ${
                message.includes("✅")
                  ? "text-green-600"
                  : message.includes("❌")
                  ? "text-red-500"
                  : "text-gray-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AAddProduct;
