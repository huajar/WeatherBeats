'use client';

import { useState, useEffect } from 'react';
import SearchBar from './components/SearchBar';
import WeatherInfo from './components/WeatherInfo';
import MusicRecommendations from './components/MusicRecommendations';
import { motion, AnimatePresence } from 'framer-motion';

const LAST_CITY_KEY = 'lastSearchedCity';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [musicRecommendations, setMusicRecommendations] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const lastCity = localStorage.getItem(LAST_CITY_KEY);
    if (lastCity) {
      setCity(lastCity);
      handleSearch(lastCity);
    }
  }, []);

  const handleSearch = async (searchedCity) => {
    setCity(searchedCity);
    localStorage.setItem(LAST_CITY_KEY, searchedCity);
    setWeatherData(null);
    setMusicRecommendations(null);
    setError(null);
    setLoadingWeather(true);
    setLoadingMusic(true);

    try {
      const weatherResponse = await fetch(
        `https://weatherbeats.onrender.com/weather/current?city=${encodeURIComponent(searchedCity)}`
      );
      const weatherResult = await weatherResponse.json();
      setWeatherData(weatherResult);
      setLoadingWeather(false);

      if (!weatherResult.error) {
        const musicResponse = await fetch(
          `https://weatherbeats.onrender.com/weather/music-recommendation?city=${encodeURIComponent(searchedCity)}`
        );
        const musicResult = await musicResponse.json();
        setMusicRecommendations(musicResult);
        setLoadingMusic(false);
      } else {
        setLoadingMusic(false);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('There was an error fetching the data.');
      setLoadingWeather(false);
      setLoadingMusic(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-4 sm:py-8 bg-gray-100"> {/* Fondo gris claro */}
      <main className="flex flex-col items-center w-full flex-1 px-4 sm:px-20 text-center">
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-4" // Acento azul/índigo sutil
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          Weather<span className="text-gray-700">Beats</span>
        </motion.h1>

        <SearchBar onSearch={handleSearch} />

        <AnimatePresence>
          {loadingWeather && (
            <motion.p
              className="mt-4 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Loading weather information...
            </motion.p>
          )}
          {weatherData && (
            <WeatherInfo weatherData={weatherData} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loadingMusic && (
            <motion.p
              className="mt-4 text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Loading music recommendations...
            </motion.p>
          )}
          {musicRecommendations && (
            <MusicRecommendations recommendations={musicRecommendations} />
          )}
        </AnimatePresence>

        {error && (
          <motion.p
            className="mt-4 text-red-500"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
      </main>

      <footer className="flex items-center justify-center w-full h-10 sm:h-12 border-t mt-6 bg-gray-200" // Fondo gris ligeramente más oscuro
      >
        <p className="text-gray-600 text-xs sm:text-sm">
          Developed with Next.js and Tailwind CSS
        </p>
      </footer>
    </div>
  );
}