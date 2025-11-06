import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";

const CContact = () => {
  return (
    <div>
      <div className="bg-gray-300 py-12 sm:py-16 px-4 sm:px-6 md:px-16 flex flex-col md:flex-row justify-around items-center text-center space-y-6 md:space-y-0 md:space-x-0">
        
        {/* Location */}
        <div className="flex flex-col items-center space-y-4 sm:space-y-5">
          <HiOutlineLocationMarker className="text-3xl sm:text-4xl" />
          <p className="text-base sm:text-lg pt-2 sm:pt-4">
            Lovit, Palakunnu, Kasaragod
          </p>
        </div>

        {/* Phone */}
        <div className="flex flex-col items-center space-y-4 sm:space-y-5">
          <FaPhoneAlt className="text-3xl sm:text-4xl" />
          <p className="text-base sm:text-lg pt-2 sm:pt-4">+91 65472 3989</p>
        </div>

        {/* Email */}
        <div className="flex flex-col items-center space-y-4 sm:space-y-5">
          <HiOutlineMail className="text-3xl sm:text-4xl" />
          <p className="text-base sm:text-lg pt-2 sm:pt-4">Lovit@gmail.com</p>
        </div>

      </div>
    </div>
  );
};

export default CContact;
