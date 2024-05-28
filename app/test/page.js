"use client";
import React, { useState } from "react";

const page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const toggleBox = () => {
    setIsOpen(!isOpen);
  };

  const handleButtonClick = (event) => {
    // Get the position of the button relative to the viewport
    const buttonRect = event.target.getBoundingClientRect();
    setPosition({ x: buttonRect.left + 10, y: buttonRect.bottom + 10 });
    toggleBox();
  };

  return (
    <div className="h-screen w-screen">
      <div className="relative">
        {/* Element that triggers the box */}
        <button
          className="bg-blue-500 text-white px-4 py-2 ml-60 mt-60"
          onClick={handleButtonClick}
        >
          Click me
        </button>

        {/* Box */}
        {isOpen && (
          <div
            className="absolute bg-white p-4 border border-gray-300 shadow-md"
            style={{ top: position.y, left: position.x }}
          >
            <p>This is some info in the box.</p>
            <button
              className="absolute top-0 right-0 mr-2 mt-1 text-sm text-gray-600"
              onClick={toggleBox}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
