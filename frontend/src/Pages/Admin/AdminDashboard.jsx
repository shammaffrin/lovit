import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-10 font-[Poppins]">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center sm:text-left">
        Admin Dashboard
      </h1>

      {/* Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <button
          onClick={() => navigate("/admin/products")}
          className="bg-blue-500 text-white px-5 py-3 rounded-lg hover:bg-blue-600 transition text-sm sm:text-base w-full"
        >
          📦 Manage Products
        </button>

        <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-green-500 text-white px-5 py-3 rounded-lg hover:bg-green-600 transition text-sm sm:text-base w-full"
        >
          ➕ Add Product
        </button>

        <button
          onClick={() => navigate("/admin/orders")}
          className="bg-purple-500 text-white px-5 py-3 rounded-lg hover:bg-purple-600 transition text-sm sm:text-base w-full"
        >
          🧾 View Orders
        </button>

        <button
          onClick={() => navigate("/admin/users")}
          className="bg-gray-500 text-white px-5 py-3 rounded-lg hover:bg-gray-600 transition text-sm sm:text-base w-full"
        >
          👥 Manage Users
        </button>
      </div>

      {/* Welcome Text */}
      <p className="text-gray-600 text-center sm:text-left text-sm sm:text-base">
        Welcome, Admin! Use the buttons above to manage products, orders, and users.
      </p>
    </div>
  );
};

export default AdminDashboard;
