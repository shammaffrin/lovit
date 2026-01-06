import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { HiOutlineLocationMarker, HiOutlineMail } from "react-icons/hi";

const CContact = () => {
  return (
  <div className="bg-gray-200 py-10 px-4">
  <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between text-center gap-8 md:gap-0">

    {/* Location */}
    <div className="flex flex-col items-center space-y-3">
      <HiOutlineLocationMarker className="text-2xl sm:text-3xl text-black" />
      <p className="text-gray-800 text-sm sm:text-base font-medium">
       1st floor City Centre building, <br /> Palakunnu, pincode:671318, <br /> Kasaragod, Kerala, India
      </p>
    </div>

    {/* Phone */}
    <div className="flex flex-col items-center space-y-3">
      <FaPhoneAlt className="text-2xl sm:text-3xl text-black" />
      <a
        href="tel:+917994560066"
        className="text-gray-800 text-sm sm:text-base font-medium hover:text-gray-600"
      >
        +91 7994560066
      </a>
    </div>

    {/* Email */}
    <div className="flex flex-col items-center space-y-3">
      <HiOutlineMail className="text-2xl sm:text-3xl text-black" />
      <a
        href="mailto:info@lovit.in"
        className="text-gray-800 text-sm sm:text-base font-medium hover:text-gray-600"
      >
       info@lovit.in
      </a>
    </div>

  </div>
</div>


  );
};

export default CContact;
