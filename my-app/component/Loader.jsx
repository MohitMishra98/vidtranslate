import React from "react";

export const DotsLoader = () => {
  return (
    <div className="flex space-x-2 justify-center items-center" role="status" aria-label="loading">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default DotsLoader;
