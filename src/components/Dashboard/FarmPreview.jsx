import React from 'react';
import farm from "../..//assets/farm.jpg";

const FarmPreview = () => {
  return (
    <div className="relative rounded-xl overflow-hidden !max-h-48 w-full h-auto">
      <img
        src={farm}
        alt="Farm landscape"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <h3 className="text-lg font-semibold">Manage your farm</h3>
        <p className="text-sm text-gray-200">Track and optimize your agricultural operations</p>
      </div>
    </div>
  );
}

export default FarmPreview;