import React from "react";
import hero from "../assets/hero.png"; // Path to your background image
import { useNavigate } from "react-router-dom";


const HeroSection = () => {
  const navigate = useNavigate();
  const darkTextColor = "text-[#333]";
  const accentColor = "#A85D25";

  return (
    <section
      className="relative w-full h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden flex items-center justify-start"
      style={{
        backgroundImage: `url(${hero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      role="banner"
      aria-label="Women's Fashion Hero Section"
    >
      {/* Mobile gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent md:hidden"></div>

      {/* Text content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 md:px-10">
        <div
          className={`w-full md:w-3/4 lg:w-1/2 ${darkTextColor} bg-white/70 md:bg-transparent p-5 md:p-0 rounded-lg backdrop-blur-[2px] md:backdrop-blur-0 animate-fadeInUp`}
        >
          {/* Title */}
          <h2
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight mb-3"
            style={{ fontFamily: "Kugile" }}
          >
            Discover the Elegance of Women's Fashion
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg leading-relaxed mb-6 text-[#A85D25] max-w-md">
            Collection of elegant dresses, party wear, and timeless essentials
            designed to make you stand out at every occasion.
          </p>

          {/* Button */}
          <button
          onClick={() => navigate("/shop")}
            className="border-2 border-[#A85D25] text-[#A85D25] px-5 py-2 sm:py-3 text-sm sm:text-base md:text-lg rounded-full tracking-wide 
              hover:bg-[#A85D25] hover:text-white transition-all duration-300 font-bold hover:scale-105 shadow-md"
            style={{ fontFamily: "Kugile" }}
          >
            Shop Now
          </button>
        </div>
      </div>

      {/* Keyframes for fade-in animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
