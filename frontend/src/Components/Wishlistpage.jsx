import React, { useEffect, useState } from "react";
import { getWishlist, removeFromWishlist } from "../api/Wishlist";
import { addToCart } from "../api/cartapi";

const WishlistPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchWishlist = async () => {
      try {
        const res = await getWishlist(userId);
        const items = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.wishlist)
          ? res.data.wishlist
          : [];
        setWishlistItems(items);
      } catch (err) {
        console.error("❌ Failed to fetch wishlist:", err);
        setWishlistItems([]);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleRemove = async (itemId) => {
    try {
      await removeFromWishlist(userId, itemId);
      setWishlistItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    }
  };

  const handleAddToCart = async (item) => {
    if (item.stock === 0) {
      return alert("This product is out of stock. Cannot add to cart.");
    }

    try {
      const productData = {
        productId: item.productId || item._id,
        title: item.title || item.name || "Untitled Product",
        price: item.price,
        mrp: item.mrp || item.price,
        quantity: 1,
        variant: {
          color: item.color || "Default",
          size: item.size || "Default",
          image: Array.isArray(item.images) ? item.images[0] : item.image,
        },
      };

      const res = await addToCart(userId, productData);

      // Remove from wishlist after adding to cart
      await removeFromWishlist(userId, item._id);
      setWishlistItems((prev) => prev.filter((i) => i._id !== item._id));

      alert(res.data.message || "✅ Item added to cart!");
    } catch (err) {
      console.error("❌ Failed to add to cart:", err.response?.data || err);
      alert("Failed to add item to cart.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-10 px-4 sm:px-8 font-[Poppins]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-black">
          My Wishlist ({wishlistItems.length})
        </h2>

        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => {
              const firstImage =
                Array.isArray(item.images) && item.images.length > 0
                  ? item.images[0]
                  : item.image;

              const isOutOfStock = item.stock === 0;

              return (
                <div
                  key={item._id}
                  className="bg-white shadow-sm rounded-md overflow-hidden border border-gray-200 hover:shadow-md transition-all"
                >
                  <img
                    src={firstImage}
                    alt={item.title || item.name}
                    className="w-full h-72 object-cover"
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />

                  <div className="p-4 flex flex-col justify-between">
                    <h3 className="text-base font-semibold text-black leading-snug mb-2">
                      {item.title || item.name}
                    </h3>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {item.description || "No description available"}
                    </p>

                    <div className="text-xs text-gray-500 mb-3">
                      {item.size && (
                        <p>
                          <span className="font-medium text-black">Size:</span>{" "}
                          {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p>
                          <span className="font-medium text-black">Color:</span>{" "}
                          {item.color}
                        </p>
                      )}
                      {item.stock !== undefined && (
                        <p>
                          <span className="font-medium text-black">Stock:</span>{" "}
                          {item.stock > 0 ? item.stock : "Out of Stock"}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg font-bold text-black">
                        ₹{item.price}
                      </span>
                      {item.mrp && (
                        <>
                          <span className="text-gray-400 line-through text-sm">
                            ₹{item.mrp}
                          </span>
                          <span className="text-green-600 text-sm font-medium">
                            {Math.round(((item.mrp - item.price) / item.mrp) * 100)}%
                            off
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={isOutOfStock}
                        className={`w-1/2 py-2 rounded-md text-sm transition-all ${
                          isOutOfStock
                            ? "bg-gray-300 cursor-not-allowed text-gray-700"
                            : "bg-[#552501] hover:bg-[#3e1b00] text-white"
                        }`}
                      >
                        {isOutOfStock ? "Out of Stock" : "ADD TO CART"}
                      </button>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="w-1/2 border border-[#552501] text-black py-2 rounded-md text-sm hover:bg-[#f2e7de] transition-all"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>Your wishlist is empty 😢</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
