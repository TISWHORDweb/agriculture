import React from 'react';
import { Cloud, Sun } from 'lucide-react';


const WeatherCard = () => {
  const forecasts = [
    { date: '25 June', temperature: 29, condition: 'Sunny' },
    { date: '26 June', temperature: 32, condition: 'Partly cloudy' },
    { date: '27 June', temperature: 39, condition: 'Sunny' },
    { date: '28 June', temperature: 42, condition: 'Sunny' },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Weather forecast</h3>
        <span className="text-xs text-green-600">next-care</span>
      </div>
      
      <div className="bg-[#F8FAFC] rounded-lg p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cloud className="h-8 w-8 text-blue-400" />
          <div>
            <span className="text-2xl font-bold">37°</span>
            <span className="text-gray-500 text-sm ml-1">/ 23°</span>
          </div>
        </div>
        <Sun className="h-6 w-6 text-yellow-400" />
      </div>

      <div className="grid grid-cols-2 gap-2">
        {forecasts.map((forecast) => (
          <div key={forecast.date} className="p-2">
            <div className="text-sm text-gray-600">{forecast.date}</div>
            <div className="font-semibold">{forecast.temperature}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherCard;