import { useState } from "react";
import {
  FaFacebookF,
  FaHeart,
  FaInstagram,
  FaShoppingCart,
  FaTimes,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Safely parse user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
    setMenuOpen(false);
  };

  const handleProtectedClick = (path) => {
    if (!isLoggedIn) {
      alert("Please login to access this page");
      navigate("/login");
    } else {
      navigate(path);
    }
    setMenuOpen(false);
  };

  return (
    <header className="w-full shadow-sm">
      {/* Top Social Bar */}
      <div className="flex justify-between items-center md:px-8 px-4 py-2 text-sm bg-white">
        <div className="flex space-x-4 text-gray-700">
          <a
            href="https://www.facebook.com/YourPageName"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF size={14} />
          </a>
          <a
            href="https://twitter.com/YourProfile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={14} />
          </a>
          <a
            href="http://www.intagram.com/Lovit.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={14} />
          </a>
          <a
            href="https://wa.me/7994560066"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp size={14} />
          </a>
        </div>

        <div>
          {!isLoggedIn && (
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

      {/* Main Navbar */}
      <nav className="bg-gray-100">
        <div className="flex items-center justify-between px-4 py-2 md:px-8">
          {/* Logo */}
          <div className="flex items-center font-bold text-[#9c5621]">
            <Link to="/">
              <img
                src={logo}
                alt="Logo"
                className="w-16 md:w-24 cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
            <li>
              <Link to="/" className="hover:text-[#9c5621]">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-[#9c5621]">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#9c5621]">
                Contact
              </Link>
            </li>

            {isLoggedIn && (
              <li className="relative group">
                <button className="hover:text-[#9c5621] py-2">
                  Hi, {user.name || "User"} ▼
                </button>
                <ul className="absolute top-6 -right-3 hidden group-hover:block bg-white shadow-md rounded-md mt-2 w-40 z-50">
                  <li>
                    <button
                      onClick={() => handleProtectedClick("/profile")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleProtectedClick("/my-orders")}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      My Orders
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}

            <li>
              <button onClick={() => handleProtectedClick("/wishlist")}>
                <FaHeart className="text-xl hover:text-[#9c5621]" />
              </button>
            </li>
            <li>
              <button onClick={() => handleProtectedClick("/cart")}>
                <FaShoppingCart className="text-xl hover:text-[#9c5621]" />
              </button>
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

        {/* Mobile Menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-lg z-50 transform animate-slideIn">
              <div className="flex justify-between items-center border-b px-4 py-3">
                <Link to="/">
                  <img src={logo} alt="Logo" className="w-16" />
                </Link>
                <FaTimes
                  onClick={() => setMenuOpen(false)}
                  className="text-xl text-gray-700 cursor-pointer"
                />
              </div>
              <div className="flex flex-col mt-6 space-y-4 px-6 text-gray-700">
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  🏠 Home
                </Link>
                <Link to="/shop" onClick={() => setMenuOpen(false)}>
                  🛍️ Shop
                </Link>
                <Link to="/contact" onClick={() => setMenuOpen(false)}>
                  📞 Contact
                </Link>

                {isLoggedIn ? (
                  <>
                    <button onClick={() => handleProtectedClick("/profile")}>
                      👤 My Profile
                    </button>
                    <button onClick={() => handleProtectedClick("/my-orders")}>
                      📦 My Orders
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-2 border-t mt-2"
                    >
                      Logout
                    </button>
                  </>
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

                <button onClick={() => handleProtectedClick("/wishlist")}>
                  ❤️ Wishlist
                </button>
                <button onClick={() => handleProtectedClick("/cart")}>
                  🛒 Cart
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </header>
  );
}
