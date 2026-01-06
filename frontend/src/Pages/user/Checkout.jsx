import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { placeOrder } from "../../api/order";
import { getCart, updateCartItem, clearUserCart } from "../../api/cartapi";
import API from "../../api/axios"; // ✅ make sure you have this axios instance

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [billing, setBilling] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [stockInfo, setStockInfo] = useState({}); // ✅ new state

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (location.state?.cartItems) {
      setItems(location.state.cartItems);
      fetchStock(location.state.cartItems);
    } else if (storedUser?._id) {
      fetchCart(storedUser._id);
    }
  }, [location.state]);

  const fetchCart = async (userId) => {
    try {
      const res = await getCart(userId);
      const data = Array.isArray(res.data) ? res.data : [];
      setItems(data);
      fetchStock(data);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setItems([]);
    }
  };

  // ✅ Fetch stock details for each item
  const fetchStock = async (cartItems) => {
    try {
      const stockData = {};
      await Promise.all(
        cartItems.map(async (item) => {
          const productId = item.productId || item._id;
          const res = await API.get(`/products/${productId}`);
          const product = res.data;

          // Match variant color (case-insensitive)
          const variant = product.variants.find(
            (v) => v.color?.toLowerCase() === item.variant?.color?.toLowerCase()
          );

          // Match size (case-insensitive)
          const sizeObj = variant?.sizes?.find(
            (s) => s.size?.toLowerCase() === item.variant?.size?.toLowerCase()
          );

          stockData[item._id] = sizeObj?.stock ?? 0;
        })
      );
      setStockInfo(stockData);
    } catch (err) {
      console.error("Failed to fetch stock info:", err);
    }
  };

  const handleQtyChange = async (itemId, qty) => {
    const newQty = Number(qty);
    if (newQty < 1) return;

    const availableStock = stockInfo[itemId] ?? 0;
    if (newQty > availableStock) {
      alert(`Only ${availableStock} left in stock!`);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: newQty } : item
      )
    );

    try {
      if (user?._id) await updateCartItem(itemId, newQty);
    } catch (err) {
      console.error("Failed to update cart:", err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setItems((prev) => prev.filter((item) => item._id !== itemId));
    try {
      if (user?._id) await updateCartItem(itemId, 0);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const total = items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0
  );

  const handlePlaceOrder = async () => {
    if (!billing.name || !billing.address || !billing.city || !billing.state) {
      alert("Please fill all billing details!");
      return;
    }

    if (!items.length) {
      alert("Your cart is empty!");
      return;
    }

    // ✅ Check stock before placing order
    for (let item of items) {
      const available = stockInfo[item._id] ?? 0;
      if (item.quantity > available) {
        alert(`Not enough stock for ${item.title}. Available: ${available}`);
        return;
      }
    }

    const shippingAddress = sameAsBilling ? billing : { ...billing };

    const orderData = {
      userId: user._id,
      items: items.map((item) => ({
        productId: item.productId || item._id,
        title: item.title || item.name || "Unknown Product",
        price: item.price || 0,
        color: item.variant?.color || item.color || "Default",
        size: item.variant?.size || item.size || "N/A",
        image: item.variant?.images?.[0] || item.mainImage || item.image || "",
        quantity: item.quantity || 1,
      })),
      shippingAddress,
      paymentMethod,
      totalAmount: total,
    };

    try {
      setLoading(true);
      const res = await placeOrder(orderData);
      await clearUserCart(user._id);
      setItems([]);

      const toast = document.createElement("div");
      toast.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center gap-3 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-popup">
          <div class="text-5xl">🎉</div>
          <h2 class="text-xl font-semibold text-gray-800">Order placed successfully!</h2>
          <p class="text-sm text-gray-500">Redirecting to your order details...</p>
        </div>
      `;
      toast.className =
        "fixed inset-0 flex items-center justify-center z-[9999] bg-black/30 backdrop-blur-sm";
      document.body.appendChild(toast);

      setTimeout(() => {
        document.body.removeChild(toast);
        navigate(`/order-success/${res.data?.order?._id || ""}`);
      }, 2500);
    } catch (err) {
      console.error("❌ Order Error:", err.response?.data || err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to place order. Please try again!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 py-10 font-sans max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-8 text-black text-center sm:text-left">
        Checkout
      </h2>

      {/* Stepper */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-10 relative">
        {["Billing", "Payment", "Confirmation"].map((label, index) => (
          <div
            key={index}
            className="flex flex-col items-center flex-1 relative mb-4 sm:mb-0"
          >
            <div
              className={`w-4 h-4 rounded-full border-2 z-10 ${
                step >= index + 1
                  ? "border-black bg-black"
                  : "border-gray-300 bg-white"
              }`}
            ></div>
            <p
              className={`text-xs mt-2 ${
                step === index + 1 ? "text-black font-medium" : "text-gray-400"
              }`}
            >
              {label}
            </p>
            {index < 2 && (
              <div
                className={`absolute top-1 sm:top-2 right-[-50%] w-full h-[2px] ${
                  step > index + 1 ? "bg-black" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Step 1 - Billing */}
      {step === 1 && (
        <div className="space-y-5">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border-b border-gray-300 outline-none py-2 text-sm"
            value={billing.name}
            onChange={(e) => setBilling({ ...billing, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full border-b border-gray-300 outline-none py-2 text-sm"
            value={billing.address}
            onChange={(e) =>
              setBilling({ ...billing, address: e.target.value })
            }
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="City"
              className="flex-1 border-b border-gray-300 outline-none py-2 text-sm"
              value={billing.city}
              onChange={(e) => setBilling({ ...billing, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="State"
              className="flex-1 border-b border-gray-300 outline-none py-2 text-sm"
              value={billing.state}
              onChange={(e) =>
                setBilling({ ...billing, state: e.target.value })
              }
            />
          </div>
          <input
            type="text"
            placeholder="Zip Code"
            className="w-full border-b border-gray-300 outline-none py-2 text-sm"
            value={billing.zipCode}
            onChange={(e) =>
              setBilling({ ...billing, zipCode: e.target.value })
            }
          />
          <label className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <input
              type="checkbox"
              checked={sameAsBilling}
              onChange={() => setSameAsBilling(!sameAsBilling)}
              className="accent-black"
            />
            Shipping Address same as billing
          </label>
          <button
            onClick={() => setStep(2)}
            className="bg-black text-white px-6 py-2 text-sm rounded-md float-right"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-medium text-lg">Payment Method</h3>

          {/* Cash on Delivery Option */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="accent-black"
            />
            Cash on Delivery
          </label>

          {/* ✅ WhatsApp Contact Option */}
<button
  onClick={() => {
    if (
      !billing.name ||
      !billing.address ||
      !billing.city ||
      !billing.state
    ) {
      alert("Please fill billing details before contacting on WhatsApp!");
      return;
    }

    // Build order details (with SKU and image)
    const orderPreview = items
      .map((item) => {
        const name = item.title || item.name || "Product";
        const sku = item.sku ? `SKU: ${item.sku}` : "";
        const size = item.variant?.size || item.size || "FREE SIZE";
        const color = item.variant?.color || item.color || "Default";
        const qty = item.quantity || 1;
        const price = item.price * qty;
        const image =
          item.variant?.images?.[0] || item.mainImage || item.image || "";

        return (
          `${name} ${sku ? `(${sku})` : ""}\n` +
          `${size}, ${color} x${qty} - ₹${price}\n` +
          (image ? `${image}` : "")
        );
      })
      .join("\n\n");

    const total = items.reduce(
      (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
      0
    );

    const message = encodeURIComponent(
      `Hello, I would like to place an order!\n\n` +
        `Order Details:\n${orderPreview}\n\n` +
        `Total: ₹${total}\n\n` +
        `Shipping Address:\n${billing.name}\n${billing.address}\n${billing.city} , ${billing.state} - ${billing.zipCode}\n\n` +
        `Please confirm the order.`
    );

    const phoneNumber = "917994560066"; // no + or spaces
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const whatsappURL = isMobile
      ? `whatsapp://send?phone=${phoneNumber}&text=${message}`
      : `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappURL, "_blank");
  }}
  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm px-6 py-2 rounded-md transition w-full sm:w-auto"
>
  <img
    src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
    alt="WhatsApp"
    className="w-4 h-4"
  />
  Contact on WhatsApp
</button>




          {/* Navigation Buttons */}
          <div className="flex justify-between mt-5 flex-col sm:flex-row gap-2">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-200 text-sm px-6 py-2 rounded-md w-full sm:w-auto"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-black text-white text-sm px-6 py-2 rounded-md w-full sm:w-auto"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3 - Confirmation */}
      {step === 3 && (
        <div className="space-y-5">
          <h3 className="font-medium text-lg">Order Confirmation</h3>

          {/* Items with stock info */}
          <div className="mt-4 border-t pt-3 space-y-2">
            {items.map((item) => {
              const available = stockInfo[item._id] ?? 0;
              return (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-1 text-xs text-gray-600 gap-2"
                >
                  <div>
                    {item.title || item.name} ({item.size || "Free Size"},{" "}
                    {item.color || "Default"})
                    <span
                      className={`ml-2 text-[11px] ${
                        available > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {available > 0
                        ? `In Stock: ${available}`
                        : "Out of Stock"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={item.quantity || 1}
                      min={1}
                      max={available || 1}
                      onChange={(e) =>
                        handleQtyChange(item._id, e.target.value)
                      }
                      className="w-12 border px-1 text-xs"
                    />
                    <span>₹{item.price * (item.quantity || 1)}</span>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-2">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-200 text-sm px-6 py-2 rounded-md w-full sm:w-auto"
            >
              Back
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-black"
              } text-white text-sm px-6 py-2 rounded-md w-full sm:w-auto`}
            >
              {loading ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
