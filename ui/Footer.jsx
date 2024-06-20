import React from "react";

const Footer = () => {
  return (
    <div className="w-full h-20 md:h-32  bg-gray-400 flex items-center justify-center p-4 md:p-10 lg:p-16">
      <div className="text-xs text-white text-center   ">
        <p>
          This project is build with Open Data Portal's API, Google Maps API,
          Next.js 13, Express, Mongoose etc.
        </p>
        <p>© 2024 Open Data Portal. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
