import React from "react";
import work from "../assets/work.jpg"
import Travel from "../assets/Travel.png"
import Denim from "../assets/Denim.jpg"
import { useNavigate } from "react-router-dom";
const collections = [
  {
    title: "Workwear",
    year: "2026",
    img: work,
  },
  {
    title: "Travel Diaries",
    year: "2026",
    img: Travel,
  },
  {
    title: "Denim Dreams",
    year: "2026",
    img: Denim,
  },
];



export default function FashionCollection() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#fffaf6] py-16 px-6">
      <h2
        className="text-3xl md:text-4xl font-semibold text-center mb-12"
        style={{ color: "#9c5621", fontFamily: "Kugile, serif" }}
      >
        Explore the Latest Trends
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {collections.map((item, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-[480px] object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-500"></div>

            {/* Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
              <h3
                className="text-3xl font-bold mb-1 drop-shadow-lg"
                style={{ fontFamily: "Kugile, serif", color: "#ffefe3" }}
              >
                {item.title}
              </h3>
              <p className="text-lg font-medium mb-6" style={{ color: "#f3c7a1" }}>
                {item.year}
              </p>
              <button
              onClick={() => navigate("/shop")}
                className="bg-white/90 text-[#9c5621] px-8 py-2 rounded-full font-semibold tracking-wide hover:bg-[#9c5621] hover:text-white transition-all duration-300"
                style={{ fontFamily: "Kugile, serif" }}
              >
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
