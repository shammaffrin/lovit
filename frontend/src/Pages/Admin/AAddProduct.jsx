import React, { useState } from "react";
import { addProduct } from "../../api/productsapi";

const AAddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [variants, setVariants] = useState([
    { color: "", price: "", sizes: [{ size: "", stock: "" }], images: [] },
  ]);
  const [uploading, setUploading] = useState(false);

  // Upload image to Cloudinary
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lovit_uploads");
    formData.append("cloud_name", "djwvjlkre");

    try {
      setUploading(true);
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/djwvjlkre/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setUploading(false);
      return data.secure_url;
    } catch {
      setUploading(false);
      alert("Image upload failed");
      return null;
    }
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setMainImage(url);
  };

  const handleVariantImageUpload = async (i, files) => {
    const uploaded = [];
    for (let file of files) {
      const url = await uploadImage(file);
      if (url) uploaded.push(url);
    }
    const updated = [...variants];
    updated[i].images.push(...uploaded);
    setVariants(updated);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { color: "", price: "", sizes: [{ size: "", stock: "" }], images: [] },
    ]);
  };

  const handleAddSize = (variantIndex) => {
    const updated = [...variants];
    updated[variantIndex].sizes.push({ size: "", stock: "" });
    setVariants(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !mainImage) return alert("Please fill required fields");

    const cleanedVariants = variants
      .map((v) => ({
        color: v.color,
        price: Number(v.price),
        images: v.images,
        sizes: v.sizes
          .filter((s) => s.size && s.stock)
          .map((s) => ({ size: s.size, stock: Number(s.stock) })),
      }))
      .filter((v) => v.color && v.price && v.sizes.length > 0);

    const productData = {
      title,
      description,
      category,
      subcategory: subcategory || "",
      mainImage,
      variants: cleanedVariants,
    };

    try {
      await addProduct(productData);
      alert("✅ Product added successfully!");
      resetForm();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setSubcategory("");
    setMainImage("");
    setVariants([{ color: "", price: "", sizes: [{ size: "", stock: "" }], images: [] }]);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Add New Product</h2>

      {/* Title & Description */}
      <input
        type="text"
        placeholder="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Category & Subcategory */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
        <input
          type="text"
          placeholder="Subcategory"
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="border p-2 rounded w-1/2"
        />
      </div>

      {/* Main Image */}
      <div className="mb-4">
        <label className="font-medium">Main Image:</label>
        <input type="file" accept="image/*" onChange={handleMainImageUpload} className="block mt-2" />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        {mainImage && <img src={mainImage} alt="Main" className="w-40 h-40 object-cover mt-2 rounded" />}
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Variants</h3>
        {variants.map((variant, i) => (
          <div key={i} className="border p-4 rounded-lg">
            <input
              type="text"
              placeholder="Color"
              value={variant.color}
              onChange={(e) => {
                const updated = [...variants];
                updated[i].color = e.target.value;
                setVariants(updated);
              }}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="number"
              placeholder="Price"
              value={variant.price}
              onChange={(e) => {
                const updated = [...variants];
                updated[i].price = e.target.value;
                setVariants(updated);
              }}
              className="border p-2 rounded w-full mb-2"
            />

            {/* Sizes */}
            <div>
              {variant.sizes.map((s, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Size"
                    value={s.size}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i].sizes[idx].size = e.target.value;
                      setVariants(updated);
                    }}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={s.stock}
                    onChange={(e) => {
                      const updated = [...variants];
                      updated[i].sizes[idx].stock = e.target.value;
                      setVariants(updated);
                    }}
                    className="border p-2 rounded w-full"
                  />
                </div>
              ))}
              <button
                onClick={() => handleAddSize(i)}
                className="text-sm bg-gray-200 px-2 py-1 rounded"
              >
                + Add Size
              </button>
            </div>

            {/* Variant Images */}
            <div className="mt-3">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleVariantImageUpload(i, e.target.files)}
              />
              <div className="flex gap-2 mt-2">
                {variant.images.map((img, j) => (
                  <img key={j} src={img} alt="" className="w-20 h-20 object-cover rounded" />
                ))}
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddVariant}
          className="bg-gray-300 text-black px-3 py-1 rounded"
        >
          + Add Variant
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-6"
      >
        Add Product
      </button>
    </div>
  );
};

export default AAddProduct;
