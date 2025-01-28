import React from 'react';

interface ProductivityData {
  month: string;
  wheat: number;
  rice: number;
  maize: number;
}

const ProductivityChart = () => {
  const data: ProductivityData[] = [
    { month: 'January 22', wheat: 39, rice: 61, maize: 17 },
    { month: 'February 22', wheat: 39, rice: 61, maize: 12 },
    { month: 'March 22', wheat: 39, rice: 61, maize: 15 },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Productive analysis</h3>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.month} className="space-y-2">
            <div className="text-sm text-gray-600">{item.month}</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Wheat</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${item.wheat}%` }}
                  />
                </div>
                <span className="text-sm">{item.wheat}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Rice</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-400 h-2 rounded-full"
                    style={{ width: `${item.rice}%` }}
                  />
                </div>
                <span className="text-sm">{item.rice}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-16">Maize</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full"
                    style={{ width: `${item.maize}%` }}
                  />
                </div>
                <span className="text-sm">{item.maize}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductivityChart;