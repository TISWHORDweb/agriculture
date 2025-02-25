import React from 'react';

const FarmPreview = () => {
  return (
    <div className="relative h-48 rounded-xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
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