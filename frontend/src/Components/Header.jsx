import { useState } from "react";
import {
  FaFacebookF,
  FaHeart,
  FaLinkedinIn,
  FaPinterestP,
  FaShoppingCart,
  FaTimes,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    setMenuOpen(false);
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className="w-full shadow-sm">
      {/* 🔹 Top Social Bar */}
      <div className="flex justify-between items-center md:px-8 px-4 py-2 text-sm bg-white">
        <div className="flex space-x-4 text-gray-700">
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaSquareXTwitter /></a>
          <a href="#"><FaPinterestP /></a>
          <a href="#"><FaLinkedinIn /></a>
        </div>

        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-black px-4 py-1 rounded-md hover:text-[#9c5621]"
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="text-black hover:text-[#9c5621]">
                Login /
              </Link>
              <Link to="/register" className="text-black hover:text-[#9c5621]">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 🔹 Main Navbar */}
      <nav className="bg-gray-100">
        <div className="flex items-center justify-between px-4 py-2 md:px-8">
          {/* Logo */}
          <div className="flex items-center font-bold text-[#9c5621]">
            <img src={logo} alt="Logo" className="w-16 md:w-24" />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
            <li><Link to="/" className="hover:text-[#9c5621]">Home</Link></li>
            <li><Link to="/shop" className="hover:text-[#9c5621]">Shop</Link></li>
            <li><Link to="/contact" className="hover:text-[#9c5621]">Contact</Link></li>
            {isLoggedIn && (
              <li><Link to="/my-orders" className="hover:text-[#9c5621]">My Orders</Link></li>
            )}
            <li>
              <Link to="/wishlist">
                <FaHeart className="text-xl hover:text-[#9c5621]" />
              </Link>
            </li>
            <li>
              <Link to="/cart">
                <FaShoppingCart className="text-xl hover:text-[#9c5621]" />
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-2xl text-gray-700"
          >
            ☰
          </button>
        </div>

        {/* 🔹 Mobile Menu (Slide-in Panel) */}
        {menuOpen && (
          <>
            {/* Background Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setMenuOpen(false)}
            ></div>

            {/* Slide-in Panel */}
            <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 transform animate-slideIn">
              <div className="flex justify-between items-center border-b px-4 py-3">
                <img src={logo} alt="Logo" className="w-16" />
                <FaTimes
                  onClick={() => setMenuOpen(false)}
                  className="text-xl text-gray-700 cursor-pointer"
                />
              </div>

              <div className="flex flex-col mt-6 space-y-4 px-6 text-gray-700">
                <Link to="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
                <Link to="/shop" onClick={() => setMenuOpen(false)}>🛍️ Shop</Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>📞 Contact</Link>

                {isLoggedIn && (
                  <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                    📦 My Orders
                  </Link>
                )}

                <Link to="/wishlist" onClick={() => setMenuOpen(false)}>
                  ❤️ Wishlist
                </Link>
                <Link to="/cart" onClick={() => setMenuOpen(false)}>
                  🛒 Cart
                </Link>

                <div className="border-t pt-4 mt-4">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="w-full bg-black text-white py-2 rounded-md"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center bg-black text-white py-2 rounded-md mb-2"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center border border-black py-2 rounded-md"
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
