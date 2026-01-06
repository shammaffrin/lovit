import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      {/* Footer Links */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 px-6 text-sm">
        {/* Customer Services */}
        <div>
          <h2 className="font-semibold mb-4">Customer Services</h2>
          <ul className="space-y-2 text-gray-300">
            <li> <Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/shop">About Us</Link></li>
            <li><Link to="/shop">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="font-semibold mb-4">Social Links</h2>
          <ul className="space-y-2 text-gray-300">
            <li>
    <a
      href="https://www.facebook.com/YourPage"
      target="_blank"
      rel="noopener noreferrer"
    >
      Facebook
    </a>
  </li>
  <li>
    <a
      href="https://www.instagram.com/Lovit.in"
      target="_blank"
      rel="noopener noreferrer"
    >
      Instagram
    </a>
  </li>
  <li>
    <a
      href="https://wa.me/7994560066"  // WhatsApp direct chat link
      target="_blank"
      rel="noopener noreferrer"
    >
      WhatsApp
    </a>
  </li>
          </ul>
        </div>

        {/* Profile */}
        <div>
          <h2 className="font-semibold mb-4">Profile</h2>
          <ul className="space-y-2 text-gray-300">
           <li>
    <Link to="/wishlist">My Wishlist</Link>
  </li>
  <li>
    <Link to="/checkout">Checkout</Link>
  </li>
  <li>
    <Link to="/order-tracking">Order Tracking</Link>
  </li>
  <li>
    <Link to="/help-support">Help & Support</Link>
  </li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h2 className="font-semibold mb-4">Contact Us</h2>
          <ul className="space-y-2 text-gray-300">
            <li>
    <a href="tel:+917994560066">+91 7994560066</a>
  </li>
  <li>
    <a href="mailto:info@lovit.in">info@lovit.in</a>
  </li>
  <li>
    <a
      href="https://www.google.com/maps/search/?api=1&query=1st+floor+City+Centre+building+Palakunnu+Kasaragod+Kerala+671318+India"
      target="_blank"
      rel="noopener noreferrer"
    >
      1st floor City Centre building, Palakunnu, pincode:671318, Kasaragod, Kerala, India
    </a>
  </li>
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
