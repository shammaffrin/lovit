import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white text-center px-6">
      {/* ✅ Success Animation */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-green-100 animate-ping"></div>
        <div className="relative flex justify-center items-center w-full h-full rounded-full bg-green-500 text-white text-5xl">
          ✓
        </div>
      </div>

      {/* ✅ Success Text */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        Thank you for shopping with us. Your order has been confirmed and will
        be processed shortly.
      </p>

      {/* ✅ Order ID Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 px-6 py-4 mb-8 max-w-md w-full">
        <p className="text-sm text-gray-400 mb-1">Order ID</p>
        <p className="text-gray-800 font-medium break-all">{id}</p>
      </div>

      {/* ✅ Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/shop")}
          className="bg-black text-white px-8 py-2 rounded-md hover:bg-gray-800 transition duration-200"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate("/my-orders")}
          className="bg-gray-200 text-gray-800 px-8 py-2 rounded-md hover:bg-gray-300 transition duration-200"
        >
          View My Orders
        </button>
      </div>

      {/* ✅ Subtle animation */}
      <style>
        {`
          @keyframes fade-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          div {
            animation: fade-up 0.6s ease-out;
          }
        `}
      </style>
    </div>
  );
}
