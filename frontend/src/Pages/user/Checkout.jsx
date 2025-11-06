import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../api/order";
import { getCart, clearUserCart } from "../../api/cartapi"; // ✅ make sure clearUserCart is added in your API

export default function CheckoutPage() {
  const navigate = useNavigate();
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

  // ✅ Fetch user + cart on load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser?._id) {
      fetchCart(storedUser._id);
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      const res = await getCart(userId);
      const data = Array.isArray(res.data) ? res.data : [];
      setItems(data);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setItems([]);
    }
  };

  const total = items.reduce((sum, i) => sum + i.price * (i.qty || 1), 0);

  const handlePlaceOrder = async () => {
  if (!billing.name || !billing.address || !billing.city || !billing.state) {
    alert("Please fill all billing details!");
    return;
  }

  if (!items.length) {
    alert("Your cart is empty!");
    return;
  }

  if (!user?._id) {
    alert("User not found. Please log in again.");
    return;
  }

  const shippingAddress = sameAsBilling
    ? billing
    : {
        name: billing.name,
        address: billing.address,
        city: billing.city,
        state: billing.state,
        zipCode: billing.zipCode,
      };

  const totalAmount = items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.qty || 1),
    0
  );

  const orderData = {
    userId: user._id,
    items: items.map((item) => ({
      productId: item.productId || item._id,          // actual product ID
      title: item.title || item.name || "Unknown Product", // product name
      price: item.price || 0,
       color: item.variant?.color || item.color || "Default", // pick variant first
    size: item.variant?.size || item.size || "N/A",        // pick variant first
      image: item.variant?.image || item.mainImage || item.image || "",
      quantity:item.variant?.quantity || item.qty || 1,
    })),
    shippingAddress,
    paymentMethod,
    totalAmount,
  };

  try {
    setLoading(true);

    // ✅ Place order
    const res = await placeOrder(orderData);

    alert("🎉 Order placed successfully!");

    // ✅ Clear cart both backend + frontend
    await clearUserCart(user._id);
    setItems([]);

    navigate(`/order-success/${res.data?.order?._id || ""}`);
  } catch (err) {
    console.error("Failed to place order:", err);
    alert("Failed to place order. Please try again!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 px-6 font-sans">
      {/* Heading */}
      <h2 className="text-2xl font-semibold mb-8 text-black">Checkout</h2>

      {/* Step progress bar */}
      <div className="flex items-center justify-between mb-10 relative">
        {["Billing", "Payment", "Confirmation"].map((label, index) => (
          <div key={index} className="flex flex-col items-center flex-1 relative">
            <div
              className={`w-3.5 h-3.5 rounded-full border-2 z-10 ${
                step >= index + 1 ? "border-black bg-black" : "border-gray-300 bg-white"
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
                className={`absolute top-[6px] right-[-50%] w-full h-[2px] ${
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
            onChange={(e) => setBilling({ ...billing, address: e.target.value })}
          />
          <div className="flex gap-3">
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
              onChange={(e) => setBilling({ ...billing, state: e.target.value })}
            />
          </div>
          <input
            type="text"
            placeholder="Zip Code"
            className="w-full border-b border-gray-300 outline-none py-2 text-sm"
            value={billing.zipCode}
            onChange={(e) => setBilling({ ...billing, zipCode: e.target.value })}
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

      {/* Step 2 - Payment */}
      {step === 2 && (
        <div className="space-y-5">
          <h3 className="font-medium text-lg">Payment Method</h3>

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

          <label className="flex items-center gap-2 text-sm opacity-60">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="accent-black"
              disabled
            />
            Pay Online (Coming Soon)
          </label>

          <div className="flex justify-between mt-5">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-200 text-sm px-6 py-2 rounded-md"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-black text-white text-sm px-6 py-2 rounded-md"
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

          <div className="text-sm text-gray-700 space-y-1">
            <p><strong>Name:</strong> {billing.name}</p>
            <p><strong>Address:</strong> {billing.address}</p>
            <p><strong>City/State:</strong> {billing.city}, {billing.state}</p>
            <p><strong>Zip:</strong> {billing.zipCode}</p>
            <p><strong>Payment:</strong> {paymentMethod.toUpperCase()}</p>
            <p><strong>Total:</strong> ₹{total}</p>
          </div>

          {/* show summary of items */}
          <div className="mt-4 border-t pt-3">
            <h4 className="text-sm font-semibold mb-2">Items:</h4>
            {items.map((item) => (
              <div
                key={item._id}
                className="text-xs text-gray-600 flex justify-between border-b py-1"
              >
                <span>
                  {item.title || item.name} ({item.size || "Free Size"}, {item.color || "Default"})
                </span>
                <span>
                  ₹{item.price} × {item.qty || 1}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(2)}
              className="bg-gray-200 text-sm px-6 py-2 rounded-md"
            >
              Back
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-black"
              } text-white text-sm px-6 py-2 rounded-md`}
            >
              {loading ? "Placing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
