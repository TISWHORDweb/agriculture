import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Droplet, Wind, Thermometer, CloudRain, CloudSun } from 'lucide-react';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const API_KEY = 'a675d61a1f8e49459bd235021253105';
        const location = 'Lagos';
        
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=3&aqi=no&alerts=no`
        );
        
        if (!response.ok) throw new Error(`WeatherAPI error: ${response.status}`);
        
        const data = await response.json();
        setWeatherData(data.current);
        setForecastData(data.forecast.forecastday);
        
      } catch (err) {
        setError(err.message);
        console.error('WeatherAPI fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const getWeatherIcon = (conditionCode) => {
    const isDay = weatherData?.is_day !== 0;
    
    switch (conditionCode) {
      case 1000: return <Sun className="h-5 w-5 text-yellow-400" />;
      case 1003: return <CloudSun className="h-5 w-5 text-yellow-300" />;
      case 1006: case 1009: return <Cloud className="h-5 w-5 text-gray-400" />;
      case 1030: case 1135: return <Cloud className="h-5 w-5 text-gray-300" />;
      case 1063: case 1180: case 1183: return <CloudRain className="h-5 w-5 text-blue-400" />;
      default: return isDay ? <Sun className="h-5 w-5 text-yellow-400" /> : <Cloud className="h-5 w-5 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold">Weather forecast</h3>
          <span className="text-xs text-green-600">next-care</span>
        </div>
        <div className="h-32 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-semibold">Weather forecast</h3>
          <span className="text-xs text-green-600">next-care</span>
        </div>
        <div className="text-center py-6 text-red-500 text-sm">
          Error loading data
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold">Weather forecast</h3>
        <span className="text-xs text-green-600">next-care</span>
      </div>
      
      {/* Current Weather - Compact */}
      {weatherData && (
        <div className="bg-[#F8FAFC] rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getWeatherIcon(weatherData.condition.code)}
              <div>
                <span className="text-xl font-bold">{weatherData.temp_c}°C</span>
                <span className="text-gray-500 text-xs ml-1">
                  Feels {weatherData.feelslike_c}°C
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm capitalize">{weatherData.condition.text}</div>
              <div className="text-xs text-gray-500">Lagos</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1 text-xs mt-2">
            <div className="flex items-center gap-1">
              <Droplet className="h-3 w-3 text-blue-400" />
              <span>{weatherData.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-3 w-3 text-gray-400" />
              <span>{weatherData.wind_kph}km/h</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="h-3 w-3 text-red-400" />
              <span>UV: {weatherData.uv}</span>
            </div>
          </div>
        </div>
      )}

      {/* Forecast - Compact */}
      <div className="grid grid-cols-3 gap-1">
        {forecastData.map((day) => (
          <div key={day.date} className="p-1 bg-gray-50 rounded text-center">
            <div className="text-xs text-gray-600">{formatDate(day.date)}</div>
            <div className="flex justify-center my-0.5">
              {getWeatherIcon(day.day.condition.code)}
            </div>
            <div className="font-medium text-sm">{day.day.avgtemp_c}°</div>
            <div className="text-xs text-gray-500">
              {Math.round(day.day.mintemp_c)}°|{Math.round(day.day.maxtemp_c)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherCard;