import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Users,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* 🌐 Mobile Header */}
      <div className="sm:hidden flex items-center justify-between bg-gray-900 text-white p-4 fixed top-0 left-0 w-full z-50 shadow-md">
        <h2 className="text-xl font-bold tracking-wide">Lovit Admin</h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="focus:outline-none hover:text-gray-300 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🧭 Sidebar */}
      <div
        className={`fixed sm:static top-0 left-0 h-full w-64 bg-gray-900 text-white flex flex-col p-5 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <h2 className="text-2xl font-bold mb-10 text-center hidden sm:block">
          Lovit Admin
        </h2>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4 mt-12 sm:mt-0">
          <NavLink
            to="/admin"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Package size={18} /> Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <ShoppingBag size={18} /> Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <Users size={18} /> Users
          </NavLink>
        </nav>

        {/* Logout */}
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* 🕶 Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 sm:hidden z-40 backdrop-blur-sm transition"
        />
      )}

      {/* Add spacing so main content doesn’t hide under mobile header */}
      <div className="sm:hidden h-14" />
    </>
  );
};

export default AdminSidebar;
