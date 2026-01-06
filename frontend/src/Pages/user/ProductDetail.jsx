import React, { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { FiHeart } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { addToCart } from "../../api/cartapi";
import { addToWishlist, getWishlist, removeFromWishlist } from "../../api/Wishlist";
import { getProductById, getRelatedProducts } from "../../api/productsapi";


// --- Subcomponent: Color Selector ---
const ColorSelector = ({ colors, selectedColor, onSelect }) => (
  <div>
    <h4 className="font-semibold mb-2">Color:</h4>
    <div className="flex gap-3 flex-wrap">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => onSelect(color)}
          className={`w-8 h-8 rounded-full border-2 ${
            selectedColor === color ? "border-gray-800" : "border-gray-300"
          }`}
          style={{ backgroundColor: color }}
          aria-label={`Select color ${color}`}
        />
      ))}
    </div>
  </div>
);

// --- Subcomponent: Size Selector ---
const SizeSelector = ({ sizes, selectedSize, onSelect }) => (
  <div>
    <h4 className="font-semibold mb-2">
      Size: <span className="font-normal text-gray-600">{selectedSize}</span>
    </h4>
    <div className="flex gap-3 flex-wrap">
      {sizes.map((size) => (
        <button
          key={size}
          onClick={() => onSelect(size)}
          className={`px-4 py-2 border rounded-md ${
            selectedSize === size
              ? "bg-gray-800 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          aria-label={`Select size ${size}`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
);

// --- Helper: Get image safely ---
const getProductImage = (product, variant = null) => {
  if (variant?.images?.length) {
    const img = variant.images[0];
    return typeof img === "string" ? img : img.url;
  }
  if (product.mainImage) return product.mainImage;
  return "https://via.placeholder.com/400?text=No+Image";
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [animateHeart, setAnimateHeart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [inCart, setInCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!localStorage.getItem("token");

  // --- Fetch product ---
// --- Fetch product ---
useEffect(() => {
  const fetchProduct = async () => {
    try {
      const { data } = await getProductById(id);
      setProduct(data);

      if (data.variants?.length) {
        const first = data.variants[0];
        setSelectedVariant(first);
        setSelectedColor(first.color);
        setSelectedSize(first.sizes?.[0]?.size || "");
        setMainImage(getProductImage(data, first));
      } else {
        setMainImage(getProductImage(data));
      }
    } catch (err) {
      console.error("❌ Failed to fetch product:", err);
    }
  };
  fetchProduct();
}, [id]);

// --- Fetch related products ---
useEffect(() => {
  if (!product?._id || !product?.category) return;

  const fetchRelated = async () => {
    try {
      const categoryName =
        typeof product.category === "object"
          ? product.category.name
          : product.category;

      const { data } = await getRelatedProducts(categoryName, product._id);
      setRelatedProducts(data);
    } catch (err) {
      console.error("❌ Failed to fetch related products:", err);
    }
  };
  fetchRelated();
}, [product?._id, product?.category]);

  // --- Fetch wishlist status ---
  useEffect(() => {
    if (!user?._id || !product?._id) return;

    const fetchWishlistStatus = async () => {
      try {
        const res = await getWishlist(user._id);
        const existing = res.data.find(
          (item) => item.productId === product._id
        );

        if (existing) {
          setInWishlist(true);
          setWishlistId(existing._id);
        } else {
          setInWishlist(false);
          setWishlistId(null);
        }
      } catch (err) {
        console.error("❌ Failed to fetch wishlist:", err);
      }
    };
    fetchWishlistStatus();
  }, [user?._id, product?._id]);

  // --- Fetch cart status ---
  useEffect(() => {
    if (!user?._id || !product?._id) return;

    const fetchCartStatus = async () => {
      try {
        const res = await API.get(`/cart/${user._id}`);
        const existing = res.data.find(
          (item) =>
            item.productId === product._id &&
            item.variant?.color === selectedColor &&
            item.variant?.size === selectedSize
        );
        setInCart(!!existing);
      } catch (err) {
        console.error("❌ Failed to check cart status:", err);
      }
    };
    fetchCartStatus();
  }, [user?._id, product?._id, selectedColor, selectedSize]);

  const selectedStock =
    selectedVariant?.sizes?.find((s) => s.size === selectedSize)?.stock || 0;
  const isOutOfStock = selectedStock === 0;

  // --- Handlers ---
  const handleColorSelect = (color) => {
    const variant = product?.variants?.find((v) => v.color === color);
    setSelectedColor(color);
    setSelectedVariant(variant);
    setSelectedSize(variant?.sizes?.[0]?.size || "");
    setMainImage(getProductImage(product, variant));
  };

  const handleSizeSelect = (size) => setSelectedSize(size);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 300);

    try {
      if (inWishlist) {
        await removeFromWishlist(user._id, wishlistId);
        setInWishlist(false);
        setWishlistId(null);
      } else {
        const payload = {
          productId: product._id,
          title: product.title,
          image: getProductImage(product, selectedVariant),
          price: selectedVariant?.price || product.price,
          color: selectedColor,
          size: selectedSize,
        };
        const res = await addToWishlist(user._id, payload);
        setInWishlist(true);
        setWishlistId(res.data.item._id);
      }
    } catch (err) {
      console.error("❌ Wishlist toggle failed:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }

    if (inCart) {
      navigate("/cart");
      return;
    }
    if (!selectedVariant || !selectedSize)
      return alert("Please select color and size");
    if (selectedStock < quantity)
      return alert(`Only ${selectedStock} item(s) available`);

    const payload = {
      productId: product._id,
      title: product.title,
      price: selectedVariant.price || product.price,
      quantity,
      variant: {
        color: selectedVariant.color,
        size: selectedSize,
        image: getProductImage(product, selectedVariant),
      },
    };

    try {
      const res = await addToCart(user._id, payload);
      alert(res.data.message || "✅ Added to cart!");
      setInCart(true);
    } catch (err) {
      console.error("❌ Add to cart error:", err);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!isLoggedIn) {
      navigate("/login", { state: { from: `/product/${id}` } });
      return;
    }
    if (!selectedVariant || !selectedSize)
      return alert("Please select color and size");
    if (selectedStock < quantity)
      return alert(`Only ${selectedStock} item(s) available`);

    const payload = {
      productId: product._id,
      title: product.title,
      price: selectedVariant.price,
      quantity,
      variant: {
        color: selectedVariant.color,
        size: selectedSize,
        image: getProductImage(product, selectedVariant),
      },
    };

    try {
      await addToCart(user._id, payload);
      navigate("/checkout");
    } catch (err) {
      console.error(err);
      alert("Failed to process Buy Now");
    }
  };

  if (!product)
    return (
      <div className="text-center py-20 text-gray-500">Loading product...</div>
    );

  const categoryName =
    typeof product.category === "object"
      ? product.category?.name
      : product.category;

  const colors = product.variants?.map((v) => v.color) || [];
  const variantImages =
    selectedVariant?.images?.map((img) =>
      typeof img === "string" ? img : img.url
    ) || [];
  const allImages = Array.from(
    new Set([product.mainImage, ...variantImages].filter(Boolean))
  );
  const sizes = selectedVariant?.sizes?.map((s) => s.size) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <p className="text-sm text-gray-500 mb-4">
        Collections / {categoryName} / {product.title}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left - Images */}
        {/* Left - Images with Zoom */}
<div>
  <div
    className="w-full h-[450px] overflow-hidden rounded-lg cursor-zoom-in relative"
    onMouseMove={(e) => {
      const img = e.currentTarget.querySelector("img");
      const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      img.style.transformOrigin = `${x}% ${y}%`;
      img.style.transform = "scale(2)";
    }}
    onMouseLeave={(e) => {
      const img = e.currentTarget.querySelector("img");
      img.style.transformOrigin = "center";
      img.style.transform = "scale(1)";
    }}
  >
    <img
      src={mainImage || "https://via.placeholder.com/400?text=No+Image"}
      alt={product.title}
      className="w-full h-full object-cover transition-transform duration-300"
    />
  </div>

  {/* Thumbnails */}
  <div className="flex gap-3 mt-4 flex-wrap">
    {allImages.map((img, idx) => (
      <img
        key={idx}
        src={img}
        alt={`thumbnail-${idx}`}
        onClick={() => setMainImage(img)}
        className={`w-20 h-24 object-cover rounded-md border cursor-pointer hover:opacity-80 transition ${
          mainImage === img ? "border-gray-800" : "border-gray-200"
        }`}
      />
    ))}
  </div>
</div>


        {/* Right - Info */}
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold">{categoryName}</h2>
            <h3 className="text-lg text-gray-700 font-medium">{product.title}</h3>
            <div className="flex items-center mt-2 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <AiFillStar key={i} size={20} />
              ))}
            </div>
          </div>

          <p className="text-2xl font-bold text-gray-800">
            ₹{selectedVariant?.price || product.price}
          </p>

          <div>
            <h4 className="font-semibold">Description :</h4>
            <p className="text-gray-600 leading-relaxed text-sm mt-1">
              {typeof product.description === "string"
                ? product.description
                : JSON.stringify(product.description)}
            </p>
          </div>

          {colors.length > 0 && (
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onSelect={handleColorSelect}
            />
          )}

          {sizes.length > 0 && (
            <SizeSelector
              sizes={sizes}
              selectedSize={selectedSize}
              onSelect={handleSizeSelect}
            />
          )}

          {isOutOfStock && (
            <p className="text-red-500 font-medium mt-2">
              This variant is currently out of stock
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-4">
            {/* Quantity */}
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                disabled={isOutOfStock}
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 transition"
                disabled={isOutOfStock || quantity >= selectedStock}
              >
                +
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlistToggle}
              className={`ml-2 border p-2 rounded-md flex items-center justify-center transition-all duration-300 ${
                inWishlist
                  ? "bg-pink-100 border-pink-400 text-pink-600"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <FiHeart
                size={22}
                color={inWishlist ? "red" : "black"}
                className={`${animateHeart ? "pop-animate" : ""}`}
              />
              <span className="ml-2 text-sm font-medium">
                {inWishlist ? "In Wishlist" : "Wishlist"}
              </span>
            </button>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`md:px-6 md:py-2 px-3 py-2 rounded-md text-white transition ${
                isOutOfStock
                  ? "bg-gray-300 cursor-not-allowed"
                  : inCart
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-[#B38B6D] hover:bg-[#a07a5f]"
              }`}
            >
              {isOutOfStock ? "Out of Stock" : inCart ? "Go to Cart" : "Add to Cart"}
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`md:px-6 md:py-2 px-3 py-2 rounded text-white transition ${
                isOutOfStock ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-15">
          <h3 className="text-3xl font-semibold mb-6 text-center text-gray-800">
            Related Products
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
              >
                <img
                  src={getProductImage(item)}
                  alt={item.title}
                  className="w-full h-60 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-gray-800 font-medium text-sm truncate">
                    {item.title}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    {item.category?.name || item.category}
                  </p>
                  <p className="text-gray-900 font-semibold mt-1">
                    ₹{item.variants?.[0]?.price ?? "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
