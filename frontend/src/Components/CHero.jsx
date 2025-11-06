// ContactLovit.jsx
import React from 'react';
import contact from "../assets/Contact.jpg";

const ContactLovit = () => {
  return (
    <div className="relative bg-white">
      {/* Top Section (Header & Text) */}
      <div className="bg-gray-100 px-6 py-12 md:px-26 md:py-16 flex flex-col md:flex-row md:items-start">
        {/* Text Content */}
        <div className="md:w-2/3 z-10">
          <h1
            className="text-4xl sm:text-5xl text-black mb-4"
            style={{ fontFamily: "Kugile" }}
          >
            Contact Lovit
          </h1>
          <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
            Collab. Connect. Create. <br />
            We love hearing from you. <br />
            Tap to reach out today!
          </p>
        </div>
      </div>

      {/* Floating Image */}
      <div className="absolute top-12 right-6 md:right-24 z-0">
        <img
          src={contact}
          alt="Floating model"
          className="w-32 sm:w-48 md:w-64 rounded-lg shadow-xl rounded-t-[50%]"
        />
      </div>

      {/* Form Section */}
      <div className="mt-16 md:pr-156 md:py-9 flex justify-center z-10 relative px-4 sm:px-6">
        <form className="w-full max-w-md space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="w-full border border-gray-400 px-4 py-2 outline-none focus:ring-2 focus:ring-black rounded"
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full border border-gray-400 px-4 py-2 outline-none focus:ring-2 focus:ring-black rounded"
          />
          <textarea
            rows="4"
            placeholder="Message"
            className="w-full border border-gray-400 px-4 py-2 outline-none focus:ring-2 focus:ring-black rounded"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-black font-bold text-lg py-2 hover:opacity-90 transition rounded mb-4"
            style={{ fontFamily: "Kugile", color: "#A85D25" }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactLovit;
