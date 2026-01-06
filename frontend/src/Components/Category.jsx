import React from "react";
import { useNavigate } from "react-router-dom";
import churidar from "../assets/churidar.jpg";
import pants from "../assets/pants.jpg";
import kurti from "../assets/kurti.jpg";
import ornaments from "../assets/ornaments.jpg";
import tops from "../assets/tops.jpg";

const allItems = [
  { name: "Churidar", img: churidar, category: "Churidar" },
  { name: "Pants", img: pants, category: "Pants" },
  { name: "Ornaments", img: ornaments, category: "Ornaments" },
  { name: "Kurti", img: kurti, category: "Kurti" },
  { name: "Tops", img: tops, category: "Tops" },
];

export default function CategoryCollection() {
  const navigate = useNavigate();

  // Updated: navigate to /shop with category as query param
  const handleCategoryClick = (category) => {
    navigate(`/shop?category=${category.toLowerCase()}`);
  };

  return (
    <div className="text-center py-10 bg-white">
      <h2
        className="text-3xl font-semibold mb-8"
        style={{ color: "#9c5621", fontFamily: "Kugile, serif" }}
      >
        Category Collection
      </h2>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 px-6 md:px-10 mb-8">
        {allItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleCategoryClick(item.category)}
            className="cursor-pointer w-full"
          >
            <img
              src={item.img}
              alt={item.name}
              className="w-full h-80 object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
            />
            <p
              className="mt-3 text-lg text-center"
              style={{ color: "#9c5621", fontFamily: "Kugile, serif" }}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>

      {/* More Button */}
      <div>
        <button
        
          className="bg-black text-white px-8 py-2 text-lg text-center rounded-full tracking-wide font-bold transition-colors duration-300 mt-4"
          style={{ fontFamily: "Kugile", color: "#A85D25" }}
          onClick={() => navigate("/shop")} // optional: go to full shop page
        >
          More
        </button>
      </div>
    </div>
  );
}
