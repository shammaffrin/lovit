import React, { useEffect, useState } from "react";
import { getCart, removeFromCart, updateCartItem } from "../api/cartapi";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;
  const shipping = 50;
  const navigate = useNavigate();

  // ✅ Fetch cart items
  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await getCart(userId);
        setCartItems(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch cart:", err);
        setCartItems([]);
      }
    };

    fetchCart();
  }, [userId]);

  // ✅ Remove item from cart
  const handleRemove = async (itemId) => {
    try {
      await removeFromCart(itemId); // ✅ FIXED (no userId)
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("❌ Failed to remove item:", err);
    }
  };

  // ✅ Update item quantity
  const handleQtyChange = async (itemId, newQty, stock) => {
    if (newQty < 1 || (stock && newQty > stock)) return;

    try {
      console.log("🟢 Updating qty:", { itemId, newQty });
      await updateCartItem(itemId, newQty); // ✅ sends { qty: newQty }
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error("❌ Failed to update quantity:", err);
    }
  };

  // ✅ Totals
  const totalPrice = Array.isArray(cartItems)
    ? cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      )
    : 0;

  const grandTotal = totalPrice + shipping;

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-10 px-4 sm:px-8 font-[Poppins]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
        {/* LEFT SECTION */}
        <div className="bg-white shadow-sm rounded-md">
          <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
            My Cart ({cartItems.length})
          </h2>

          {cartItems.length === 0 ? (
            <p className="p-4 text-gray-500">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => {
              const productImage =
                item.variant?.image ||
                (Array.isArray(item.images) ? item.images[0] : item.image);

              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-100"
                >
                  {/* ✅ Image */}
                  <img
                    src={productImage}
                    alt={item.title}
                    className="w-32 h-40 object-cover rounded-md"
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />

                  {/* ✅ Details */}
                  <div className="flex flex-col justify-between w-full">
                    <div>
                      <h3 className="text-base font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* ✅ Variant Info */}
                      <div className="text-xs text-gray-600 mt-2 space-y-1">
                        {item.variant?.size && (
                          <p>
                            <span className="font-medium text-black">Size:</span>{" "}
                            {item.variant.size}
                          </p>
                        )}
                        {item.variant?.color && (
                          <p>
                            <span className="font-medium text-black">Color:</span>{" "}
                            {item.variant.color}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ✅ Price */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-black">
                        ₹{item.price}
                      </span>
                      {item.mrp && (
                        <span className="text-gray-400 line-through text-sm">
                          ₹{item.mrp}
                        </span>
                      )}
                    </div>

                    {/* ✅ Quantity Controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleQtyChange(item._id, item.quantity - 1, item.stock)
                        }
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQtyChange(item._id, item.quantity + 1, item.stock)
                        }
                        disabled={item.stock ? item.quantity >= item.stock : false}
                        className="px-2 py-1 border rounded disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    {/* ✅ Actions */}
                    <div className="mt-3 flex gap-4 text-sm text-[#552501] font-medium">
                      <button>Save for later</button>
                      <button onClick={() => handleRemove(item._id)}>Remove</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="bg-white shadow-sm rounded-md h-fit">
          <h3 className="text-lg font-semibold p-4 border-b border-gray-200">
            PRICE DETAILS
          </h3>
          <div className="p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Charges</span>
              <span>₹{shipping}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 font-semibold text-base flex justify-between">
              <span>Total Amount</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/checkout")}
              disabled={cartItems.length === 0}
              className={`w-full px-5 py-2 rounded-md text-sm transition-all ${
                cartItems.length === 0
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-[#552501]"
              }`}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
