import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { getProducts } from "../api/productsapi";
import { addToWishlist, removeFromWishlist, getWishlist } from "../api/Wishlist";
import { addToCart, getCart } from "../api/cartapi"; // ✅ import getCart

const categories = [
  { name: "Churidar", subcategories: ["Party Wear", "Pakistani", "Material"] },
  { name: "Kurti" },
  { name: "Gowns" },
  { name: "Cord-sets" },
];

const ShopC = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]); // ✅ added cart state
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  /* ✅ Load Wishlist */
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?._id) return;
      try {
        const res = await getWishlist(user._id);
        setWishlist(res.data || []);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      }
    };
    fetchWishlist();
  }, [user?._id]);

  /* ✅ Load Cart */
  useEffect(() => {
    const fetchCart = async () => {
      if (!user?._id) return;
      try {
        const res = await getCart(user._id);
        setCart(res.data || []);
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };
    fetchCart();
  }, [user?._id]);

  /* ✅ Load category/subcategory from query */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category)
      setSelectedSub({ cat: category.charAt(0).toUpperCase() + category.slice(1) });
  }, [location.search]);

  /* ✅ Fetch products */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts(selectedSub?.cat || "", selectedSub?.sub || "");
        if (Array.isArray(res.data)) setProducts(res.data);
        else if (Array.isArray(res.data.products)) setProducts(res.data.products);
        else if (Array.isArray(res.data.data)) setProducts(res.data.data);
        else setProducts([]);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [selectedSub]);

  /* ✅ Filter Handlers */
  const handleAllClick = () => setSelectedSub(null);
  const handleMainClick = (cat) => {
    const categoryObj = categories.find((c) => c.name === cat);
    if (categoryObj.subcategories)
      setExpandedCategory((prev) => (prev === cat ? null : cat));
    setSelectedSub({ cat });
  };
  const handleSubSelect = (cat, sub) => setSelectedSub({ cat, sub });

  /* ✅ Wishlist Toggle */
  const handleWishlistToggle = async (product) => {
    if (!user?._id) {
      alert("Please login to use wishlist");
      return;
    }

    const isInWishlist = wishlist.some((item) => item.productId === product._id);

    try {
      if (isInWishlist) {
        const item = wishlist.find((item) => item.productId === product._id);
        await removeFromWishlist(user._id, item._id);
        setWishlist((prev) => prev.filter((w) => w.productId !== product._id));
      } else {
        const res = await addToWishlist(user._id, {
          productId: product._id,
          title: product.title,
          image:
            product.variants?.[0]?.images?.[0] ||
            product.mainImage ||
            "/placeholder.png",
          price: product.variants?.[0]?.price || product.price,
        });
        setWishlist((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error("Wishlist update failed:", err);
    }
  };

  /* ✅ Add to Cart */
  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    if (!user?._id) {
      alert("Please login to add to cart");
      return;
    }

    const firstVariant = product.variants?.[0];
    const cartItem = {
      productId: product._id,
      title: product.title,
      image: firstVariant?.images?.[0] || product.mainImage || "/placeholder.png",
      price: firstVariant?.price || product.price,
      qty: 1,
    };

    try {
      await addToCart(user._id, cartItem);
      setCart((prev) => [...prev, cartItem]); // ✅ instantly reflect change
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Something went wrong!");
    }
  };

  /* ✅ Product Detail */
  const handleProductClick = (product) =>
    navigate(`/product/${product._id}`, { state: { product } });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-8">
      {/* Header */}
      <h1
        className="text-center font-semibold text-4xl mb-10"
        style={{ fontFamily: "Kugile" }}
      >
        Collections /{" "}
        <span className="font-light">
          {selectedSub?.sub || selectedSub?.cat || "All"}
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <h2 className="text-lg mb-4">FILTERS</h2>
          <div className="space-y-1 text-sm">
            <div
              className="flex items-center space-x-2 cursor-pointer py-1"
              onClick={handleAllClick}
            >
              <div
                className={`w-4 h-4 border border-black flex items-center justify-center ${
                  !selectedSub ? "bg-black text-white" : ""
                }`}
              >
                {!selectedSub && "✓"}
              </div>
              <span>All</span>
            </div>

            {categories.map((cat) => (
              <div key={cat.name}>
                <div
                  className="flex items-center gap-4 cursor-pointer py-1"
                  onClick={() => handleMainClick(cat.name)}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 border border-black flex items-center justify-center ${
                        selectedSub?.cat === cat.name && !selectedSub?.sub
                          ? "bg-black text-white"
                          : ""
                      }`}
                    >
                      {selectedSub?.cat === cat.name && !selectedSub?.sub && "✓"}
                    </div>
                    <span>{cat.name}</span>
                  </div>
                  {cat.subcategories &&
                    (expandedCategory === cat.name ? (
                      <ChevronUp className="w-4 h-4 text-black" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-black" />
                    ))}
                </div>

                {expandedCategory === cat.name &&
                  cat.subcategories?.map((sub) => (
                    <div
                      key={sub}
                      className="flex items-center space-x-2 ml-6 cursor-pointer py-1"
                      onClick={() => handleSubSelect(cat.name, sub)}
                    >
                      <div
                        className={`w-3.5 h-3.5 border border-black flex items-center justify-center ${
                          selectedSub?.sub === sub ? "bg-black text-white" : ""
                        }`}
                      >
                        {selectedSub?.sub === sub && "✓"}
                      </div>
                      <span>{sub}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Product Grid */}
        <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((product) => {
              const firstVariant = product.variants?.[0];
              const image =
                firstVariant?.images?.[0] ||
                product.mainImage ||
                "/placeholder.png";
              const price = firstVariant?.price || product.price || "N/A";
              const isInWishlist = wishlist.some(
                (item) => item.productId === product._id
              );
              const isInCart = cart.some(
                (item) => item.productId === product._id
              ); // ✅ fixed line

              return (
                <div
                  key={product._id}
                  className="text-center group cursor-pointer"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="overflow-hidden rounded-lg shadow-sm mb-3">
                    <img
                      src={image}
                      alt={product.title}
                      className="w-full h-80 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </div>
                  <h3 className="text-sm font-medium text-justify mb-1">
                    {product.title}
                  </h3>

                  <div className="flex items-center space-x-3 mt-2 justify-center">
                    {/* ❤️ Wishlist */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                      className={`border rounded-full p-2 flex items-center justify-center transition-colors ${
                        isInWishlist
                          ? "bg-red-500 text-white border-red-500"
                          : "border-gray-400 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {isInWishlist ? (
                        <FaHeart className="text-white" />
                      ) : (
                        <FaRegHeart className="text-gray-600" />
                      )}
                    </button>

                    {/* 🛒 Cart */}
                    {isInCart ? (
                      <button
                        disabled
                        className="bg-gray-400 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-not-allowed"
                      >
                        Added to Cart
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-[#B68A6B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#A27657] transition-colors"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center col-span-full text-gray-500">
              No products found for this selection.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopC;
