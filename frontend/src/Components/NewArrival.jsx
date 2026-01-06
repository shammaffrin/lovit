import React from "react";
import NewArrival2 from "../assets/NewArrival2.jpg"
import NewArrival1 from "../assets/NewArrival1.jpg"
import { useNavigate } from "react-router-dom";
const NewArrivalSection = () => {
  const navigate = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-10 items-center bg-[#fffaf6]">
      {/* Left Side — Image Focus */}
      <div className="relative group">
        <img
          src={NewArrival2}
          alt="New Arrival Dress"
          className="w-full h-[480px] object-cover rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl group-hover:scale-105"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Kugile, serif" }}>
            Elegant New Arrivals
          </h2>
          <p className="text-sm md:text-base font-light tracking-wide">
            Discover timeless silhouettes and soft shades
          </p>
        </div>
      </div>

      {/* Right Side — Text & Secondary Image */}
      <div className="space-y-6 text-center lg:text-left">
        <h3
          className="text-4xl md:text-5xl font-semibold text-[#9c5621]"
          style={{ fontFamily: "Kugile, serif" }}
        >
          Step into Grace
        </h3>
        <p className="text-gray-700 leading-relaxed md:w-4/5">
          Our newest collection blends effortless elegance with modern comfort.
          From flowing kurtis to chic tops — redefine your everyday look.
        </p>

        <button
        onClick={() => navigate("/shop")}
          className="bg-[#9c5621] text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-[#804819] transition-colors duration-300"
          style={{ fontFamily: "Kugile, serif" }}
        >
          Shop Now
        </button>

        <div className="overflow-hidden rounded-2xl shadow-md">
          <img
            src={NewArrival1}
            alt="Fashion Model"
            className="w-full h-[320px] object-cover top hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    </section>
  );
};

export default NewArrivalSection;
