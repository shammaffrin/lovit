import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      {/* Footer Links */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6 text-sm">
        {/* Customer Services */}
        <div>
          <h2 className="font-semibold mb-4">Customer Services</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Home</li>
            <li>Shop</li>
            <li>About us</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="font-semibold mb-4">Social Links</h2>
          <ul className="space-y-2 text-gray-300">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>Whatsapp</li>
          </ul>
        </div>

        {/* Profile */}
        <div>
          <h2 className="font-semibold mb-4">Profile</h2>
          <ul className="space-y-2 text-gray-300">
            <li>My Wishlist</li>
            <li>Checkout</li>
            <li>Order Tracking</li>
            <li>Help & Support</li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h2 className="font-semibold mb-4">Contact Us</h2>
          <ul className="space-y-2 text-gray-300">
            <li>+762427171</li>
            <li>lovit@gmail.com</li>
            <li>Palakkunnu, Kasaragod, Kerala</li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-gray-400 text-xs mt-10 border-t border-gray-800 pt-4">
        ©2024 All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
