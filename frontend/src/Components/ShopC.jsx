import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getProducts } from "../api/productsapi";
import { addToWishlist, removeFromWishlist, getWishlist } from "../api/Wishlist";
import { addToCart, getCart } from "../api/cartapi";
import { toast } from "react-toastify";

const ShopC = () => {
  const [categories, setCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Helper: Get category name whether it's a string or object
  const getCategoryName = (cat) => {
    if (!cat) return "";
    return typeof cat === "string" ? cat : cat.name;
  };

  // Fetch products and build category/subcategory map
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await getProducts();
        const allProducts = res.data || [];
        setProducts(allProducts);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(allProducts.map(p => getCategoryName(p.category)).filter(Boolean))
        ];

        // Build category -> subcategories map
        const catMap = {};
        uniqueCategories.forEach(catName => {
          catMap[catName] = [
            ...new Set(
              allProducts
                .filter(p => getCategoryName(p.category) === catName && p.subcategory)
                .map(p => p.subcategory)
            ),
          ];
        });

        setCategories(uniqueCategories);
        setCategoryMap(catMap);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Wishlist & Cart fetch
  useEffect(() => {
    if (!user?._id) return;
    getWishlist(user._id).then(res => setWishlist(res.data || []));
    getCart(user._id).then(res => setCart(res.data || []));
  }, [user?._id]);

  // Filter products by category/subcategory
  const filteredProducts = products.filter(p => {
    const catName = getCategoryName(p.category);
    if (selectedCat && selectedSub) return catName === selectedCat && p.subcategory === selectedSub;
    if (selectedCat) return catName === selectedCat;
    return true;
  });

  // Handlers
  const handleAllClick = () => {
    setSelectedCat(null);
    setSelectedSub(null);
    setExpandedCategory(null);
  };

  const handleCategorySelect = cat => {
    setSelectedCat(cat);
    setSelectedSub(null);
    setExpandedCategory(prev => (prev === cat ? null : cat));
  };

  const handleSubSelect = sub => {
    setSelectedSub(sub);
  };

  const handleWishlistToggle = async product => {
    if (!user?._id) return toast.info("Please login to use wishlist");
    const isInWishlist = wishlist.some(item => item.productId === product._id);

    try {
      if (isInWishlist) {
        const item = wishlist.find(i => i.productId === product._id);
        await removeFromWishlist(user._id, item._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(user._id, {
          productId: product._id,
          title: product.title,
          image: product.variants?.[0]?.images?.[0] || product.mainImage || "/placeholder.png",
          price: product.variants?.[0]?.price || 0,
        });
        toast.success("Added to wishlist");
      }
      const res = await getWishlist(user._id);
      setWishlist(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Wishlist update failed");
    }
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    if (!user?._id) return toast.info("Please login to add to cart");

    const firstVariant = product.variants?.[0];
    const cartItem = {
      productId: product._id,
      title: product.title,
      image: firstVariant?.images?.[0] || product.mainImage || "/placeholder.png",
      price: firstVariant?.price || 0,
      qty: 1,
    };

    try {
      await addToCart(user._id, cartItem);
      const res = await getCart(user._id);
      setCart(res.data || []);
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  const handleProductClick = product => navigate(`/product/${product._id}`, { state: { product } });

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 md:px-8">
      <h1 className="text-center font-semibold text-4xl mb-10">
        Collections / {selectedCat || "All"}{selectedSub ? ` / ${selectedSub}` : ""}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <h2 className="text-lg mb-4">FILTERS</h2>
          <div className="space-y-1 text-sm">
            <div className="flex items-center space-x-2 cursor-pointer py-1" onClick={handleAllClick}>
              <div className={`w-4 h-4 border border-black flex items-center justify-center ${!selectedCat ? "bg-black text-white" : ""}`}>
                {!selectedCat && "✓"}
              </div>
              <span>All</span>
            </div>

            {categories.map(cat => (
              <div key={cat}>
                <div className="flex items-center justify-between cursor-pointer py-1" onClick={() => handleCategorySelect(cat)}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 border border-black flex items-center justify-center ${selectedCat === cat ? "bg-black text-white" : ""}`}>
                      {selectedCat === cat && "✓"}
                    </div>
                    <span>{cat}</span>
                  </div>
                  {categoryMap[cat]?.length > 0 && (expandedCategory === cat ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                </div>

                {categoryMap[cat] && expandedCategory === cat &&
                  categoryMap[cat].map(sub => (
                    <div key={sub} className="flex items-center space-x-2 ml-6 cursor-pointer py-1" onClick={() => handleSubSelect(sub)}>
                      <div className={`w-4 h-4 border border-black flex items-center justify-center ${selectedSub === sub ? "bg-black text-white" : ""}`}>
                        {selectedSub === sub && "✓"}
                      </div>
                      <span>{sub}</span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="text-center col-span-full">Loading products...</p>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map(product => {
              const firstVariant = product.variants?.[0];
              const image = firstVariant?.images?.[0] || product.mainImage || "/placeholder.png";
              const price = firstVariant?.price || 0;
              const isInWishlist = wishlist.some(item => item.productId === product._id);
              const isInCart = cart.some(item => item.productId === product._id);

              return (
                <div key={product._id} className="text-center group cursor-pointer" onClick={() => handleProductClick(product)}>
                  <div className="overflow-hidden rounded-lg shadow-sm mb-3">
                    <img src={image} alt={product.title} className="w-full h-80 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-sm font-medium text-justify mb-1">{product.title}</h3>
                  <p className="text-[18px] text-justify ">
  ₹{product.variants?.[0]?.price ?? "N/A"}
</p>

                  <div className="flex items-center space-x-3 mt-2 justify-center">
                    <button onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product); }}
                      className={`border rounded-full p-2 flex items-center justify-center ${isInWishlist ? "bg-red-500 text-white border-red-500" : "border-gray-400 text-gray-700 hover:bg-gray-100"}`}>
                      {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                    </button>
                    {isInCart ? (
                      <button disabled className="bg-gray-400 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-not-allowed">Added to Cart</button>
                    ) : (
                      <button onClick={(e) => handleAddToCart(product, e)} className="bg-[#B68A6B] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#A27657]">Add to Cart</button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center col-span-full text-gray-500">No products found for this selection.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopC;
