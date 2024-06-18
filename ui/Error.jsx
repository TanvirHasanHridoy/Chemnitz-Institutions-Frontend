import React from "react";

const ErrorComponent = ({ message }) => {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <h1 className="font-extrabold text-3xl py-4 mb-4">Error</h1>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default ErrorComponent;
