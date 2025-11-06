import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import { addToCart } from "../../api/cartapi";
import { addToWishlist } from "../../api/Wishlist";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        const data = res.data;
        console.log("🟢 Product data:", data);
        setProduct(data);

        if (data.variants?.length > 0) {
          const first = data.variants[0];
          setSelectedVariant(first);
          setSelectedColor(first.color);
          setSelectedSize(first.sizes?.[0]?.size || "");
          setMainImage(first.images?.[0]?.url || first.images?.[0] || data.mainImage || "");
        } else {
          // ✅ Use mainImage if available, fallback to image
          setMainImage(data.mainImage || data.image || "");
        }
      } catch (err) {
        console.error("❌ Failed to fetch product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleColorSelect = (color) => {
    const variant = product?.variants?.find((v) => v.color === color);
    setSelectedColor(color);
    setSelectedVariant(variant);
    setSelectedSize(variant?.sizes?.[0]?.size || "");
    setMainImage(
      variant?.images?.[0]?.url || variant?.images?.[0] || product?.mainImage || product?.image
    );
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login first");

    if (!selectedVariant || !selectedSize) {
      return alert("Please select color and size");
    }

    const payload = {
      productId: product._id,
      title: product.title,
      price: selectedVariant.price,
      quantity,
      variant: {
        color: selectedVariant.color,
        size: selectedSize,
        image: mainImage,
      },
    };

    try {
      console.log("🟢 Sending to backend:", payload);
      const res = await addToCart(user._id, payload);
      alert(res.data.message || "✅ Added to cart!");
    } catch (err) {
      console.error("❌ Add to cart failed:", err.response?.data || err);
      alert(err.response?.data?.message || "Something went wrong while adding to cart.");
    }
  };

  const handleAddToWishlist = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please login first");

    const payload = {
      productId: product._id,
      title: product.title,
      image: mainImage,
      price: selectedVariant?.price || product.price,
      color: selectedColor,
      size: selectedSize,
    };

    try {
      const res = await addToWishlist(user._id, payload);
      if (res.data.message?.includes("Already")) {
        alert("Already in wishlist ❤️");
      } else {
        alert("Added to wishlist 💖");
      }
    } catch (err) {
      console.error("❌ Wishlist error:", err);
      alert("Failed to add to wishlist");
    }
  };

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading product...
      </div>
    );
  }

  const colors = product.variants?.map((v) => v.color) || [];

  // ✅ Combine mainImage + variant images for thumbnails
  const variantImages =
    selectedVariant?.images?.map((img) => (typeof img === "string" ? img : img.url)) || [];
  const allImages = [product.mainImage, ...variantImages].filter(Boolean);

  const sizes = selectedVariant?.sizes?.map((s) => s.size) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <p className="text-sm text-gray-500 mb-4">
        Collections / {product.category} / {product.title}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Section - Images */}
        <div>
          <img
            src={
              mainImage ||
              product.mainImage ||
              "https://via.placeholder.com/400?text=No+Image"
            }
            alt={product.title}
            className="w-full h-[450px] object-cover rounded-lg"
          />
          <div className="flex gap-3 mt-4 flex-wrap">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="thumbnail"
                onClick={() => setMainImage(img)}
                className={`w-20 h-24 object-cover rounded-md border cursor-pointer hover:opacity-80 transition ${
                  mainImage === img ? "border-gray-800" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">{product.category}</h2>
            <h3 className="text-lg text-gray-700 font-medium">
              {product.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center mt-2 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <AiFillStar key={i} size={20} />
              ))}
            </div>
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-gray-800">
            ₹{selectedVariant?.price || product.price}
          </p>

          {/* Description */}
          <div>
            <h4 className="font-semibold">Description :</h4>
            <p className="text-gray-600 leading-relaxed text-sm mt-1">
              {product.description}
            </p>
          </div>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Color:</h4>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {sizes.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">
                Size :{" "}
                <span className="font-normal text-gray-600">
                  {selectedSize}
                </span>
              </h4>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-4 py-2 border rounded-md ${
                      selectedSize === size
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
              >
                +
              </button>
            </div>

            <button
              className="ml-2 border p-2 rounded-md hover:bg-gray-100"
              onClick={handleAddToWishlist}
            >
              <FiHeart size={20} />
            </button>

            <button
              onClick={handleAddToCart}
              className="md:px-6 md:py-2 px-3 py-2 bg-[#B38B6D] text-white rounded-md hover:bg-[#a07a5f] transition"
            >
              Add to cart
            </button>

            <button className="md:px-6 md:py-2 px-3 py-2 rounded bg-black text-white hover:bg-gray-800 transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
