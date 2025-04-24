'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherInfo from './components/WeatherInfo';
import MusicRecommendations from './components/MusicRecommendations';
import ErrorDisplay from './components/ErrorDisplay';

const LAST_CITY_KEY = 'lastSearchedCity';
const LAST_COORDS_KEY = 'lastCoords';
const API_BASE_URL = 'https://weatherbeats.onrender.com';

export default function Home() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [musicRecommendations, setMusicRecommendations] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to load from localStorage first
    const lastCity = localStorage.getItem(LAST_CITY_KEY);
    const lastCoords = localStorage.getItem(LAST_COORDS_KEY);
    
    if (lastCity) {
      setCity(lastCity);
      handleSearch(lastCity);
    } else if (lastCoords) {
      // If we have coordinates but no city name
      try {
        const { lat, lon } = JSON.parse(lastCoords);
        handleLocationSearch(lat, lon);
      } catch (e) {
        console.error('Error parsing saved coordinates:', e);
      }
    } else {
      // Try to get location automatically on first load
      tryGetLocationAutomatically();
    }
  }, []);

  const tryGetLocationAutomatically = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationSearch(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation permission not granted or error:', error);
          // No error displayed to user initially - they'll use manual search
        }
      );
    }
  };

  const handleSearch = async (searchedCity) => {
    if (!searchedCity.trim()) {
      setError('Please enter a city name');
      return;
    }

    setCity(searchedCity);
    localStorage.setItem(LAST_CITY_KEY, searchedCity);
    
    // Reset states
    setWeatherData(null);
    setMusicRecommendations(null);
    setError(null);
    setLoadingWeather(true);
    setLoadingMusic(false);

    try {
      // Fetch weather data
      const weatherResponse = await axios.get(`${API_BASE_URL}/weather/current`, {
        params: { city: searchedCity },
        timeout: 10000
      });
      
      setWeatherData(weatherResponse.data);
      setLoadingWeather(false);
      
      // Only fetch music recommendations if weather data was successfully fetched
      setLoadingMusic(true);
      try {
        const musicResponse = await axios.get(`${API_BASE_URL}/weather/music-recommendation`, {
          params: { city: searchedCity },
          timeout: 15000
        });
        
        setMusicRecommendations(musicResponse.data);
      } catch (musicError) {
        console.error('Error fetching music recommendations:', musicError);
        setError({
          message: 'Could not load music recommendations',
          details: musicError.message
        });
      } finally {
        setLoadingMusic(false);
      }
    } catch (weatherError) {
      console.error('Error fetching weather data:', weatherError);
      
      if (weatherError.response) {
        if (weatherError.response.status === 404) {
          setError({ 
            status: 404,
            message: 'City not found. Please check the spelling and try again.'
          });
        } else {
          setError({
            status: weatherError.response.status,
            message: 'Server error. Please try again later.'
          });
        }
      } else if (weatherError.request) {
        setError({
          message: 'No response from server. Please check your internet connection.'
        });
      } else {
        setError({
          message: 'An error occurred while processing your request.'
        });
      }
      
      setLoadingWeather(false);
      setLoadingMusic(false);
    }
  };

  const handleLocationSearch = async (latitude, longitude) => {
    // Store coordinates in localStorage
    localStorage.setItem(LAST_COORDS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
    
    // Reset states
    setWeatherData(null);
    setMusicRecommendations(null);
    setError(null);
    setLoadingWeather(true);
    setLoadingMusic(false);
    setCity(''); // Clear city since we're using coordinates

    try {
      // Fetch weather data by coordinates
      const weatherResponse = await axios.get(`${API_BASE_URL}/weather/current/coordinates`, {
        params: { lat: latitude, lon: longitude },
        timeout: 10000
      });
      
      setWeatherData(weatherResponse.data);
      
      // If we got a city name from the weather data, update the city state
      if (weatherResponse.data && weatherResponse.data.location && weatherResponse.data.location.name) {
        setCity(weatherResponse.data.location.name);
        localStorage.setItem(LAST_CITY_KEY, weatherResponse.data.location.name);
      }
      
      setLoadingWeather(false);
      
      // Only fetch music recommendations if weather data was successfully fetched
      setLoadingMusic(true);
      try {
        const musicResponse = await axios.get(`${API_BASE_URL}/weather/music-recommendation/coordinates`, {
          params: { lat: latitude, lon: longitude },
          timeout: 15000
        });
        
        setMusicRecommendations(musicResponse.data);
      } catch (musicError) {
        console.error('Error fetching music recommendations:', musicError);
        setError({
          message: 'Could not load music recommendations',
          details: musicError.message
        });
      } finally {
        setLoadingMusic(false);
      }
    } catch (weatherError) {
      console.error('Error fetching weather data by coordinates:', weatherError);
      
      if (weatherError.response) {
        setError({
          status: weatherError.response.status,
          message: 'Could not get weather for your location. Please try manual search.'
        });
      } else if (weatherError.request) {
        setError({
          message: 'No response from server. Please check your internet connection.'
        });
      } else {
        setError({
          message: 'An error occurred while processing your location.'
        });
      }
      
      setLoadingWeather(false);
      setLoadingMusic(false);
    }
  };

  const handleRetry = () => {
    if (city) {
      handleSearch(city);
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex flex-col items-center w-full px-4 sm:px-6 py-8 text-center">
        <div className="w-full max-w-4xl mx-auto">
          <SearchBar 
            onSearch={handleSearch} 
            initialCity={city} 
            onLocationSearch={handleLocationSearch}
          />

          <AnimatePresence mode="wait">
            {error && (
              <ErrorDisplay error={error} onRetry={handleRetry} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {loadingWeather && (
              <motion.div
                className="flex justify-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-200 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            {weatherData && !error && (
              <WeatherInfo weatherData={weatherData} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {loadingMusic && (
              <motion.div
                className="flex justify-center items-center mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="text-indigo-600">
                  <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Finding the perfect beats for this weather...</p>
              </motion.div>
            )}
            {musicRecommendations && !error && (
              <MusicRecommendations recommendations={musicRecommendations} />
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="w-full py-4 bg-gray-800 text-gray-300 text-center">
        <p className="text-sm">
          Developed with Next.js and Tailwind CSS | &copy; {new Date().getFullYear()} WeatherBeats
        </p>
      </footer>
    </div>
  );
}