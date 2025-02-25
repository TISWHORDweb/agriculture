import React from 'react';

const HarvestingCost = () => {
  return (
    <div className="bg-[#F0FDF4] rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Harvesting Cost</h3>
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rice</span>
              <span>$150</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Wheat</span>
              <span>$250</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total production</span>
              <span>$100K</span>
            </div>
          </div>
        </div>
        <div className="w-24 h-24">
          <svg viewBox="0 0 36 36" className="w-full h-full">
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="3"
              strokeDasharray="75, 100"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default HarvestingCost;