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
      <div className="relative"></div>
    </div>
  );
};

export default page;
