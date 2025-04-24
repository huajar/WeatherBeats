import React from 'react';
import { motion } from 'framer-motion';

const WeatherInfo = ({ weatherData }) => {
  if (!weatherData) {
    return null;
  }

  if (weatherData.error) {
    return <p className="mt-4 text-red-500">{weatherData.message || 'Error fetching weather.'}</p>;
  }

  return (
    <motion.div
      className="mt-4 p-4 border rounded-md shadow-sm bg-white"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-800">{weatherData.location.name}, {weatherData.location.country}</h2>
      <p className="text-gray-700">{weatherData.current.condition.text}</p>
      <div className="flex items-center mt-2">
        <motion.img
          src={`https:${weatherData.current.condition.icon}`}
          alt="Weather Icon"
          className="w-12 h-12 mr-2"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, when: "started" }}
        />
        <p className="text-2xl font-bold text-gray-800">{weatherData.current.temp_c}°C</p>
        <p className="ml-2 text-gray-600">({weatherData.current.temp_f}°F)</p>
      </div>
      <p className="text-sm text-gray-600">Updated: {weatherData.current.last_updated}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-700">
        <div>Humidity: <motion.span className="font-semibold text-gray-800" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5 }}>{weatherData.current.humidity}%</motion.span></div>
        <div>Wind: <motion.span className="font-semibold text-gray-800" animate={{ translateX: [0, 5, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>{weatherData.current.wind_kph} km/h ({weatherData.current.wind_dir})</motion.span></div>
        <div>Pressure: <span className="font-semibold text-gray-800">{weatherData.current.pressure_mb} mb</span></div>
        <div>Feels like: <span className="font-semibold text-gray-800">{weatherData.current.feelslike_c}°C</span></div>
        <div>Precipitation: <span className="font-semibold text-gray-800">{weatherData.current.precip_mm} mm</span></div>
        <div>Clouds: <span className="font-semibold text-gray-800">{weatherData.current.cloud}%</span></div>
      </div>
    </motion.div>
  );
};

export default WeatherInfo;