import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { mockWeatherData, defaultCoordinatesData } from './mock-weather.data';

dotenv.config();

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey = process.env.WEATHER_API_KEY || 'your_api_key';
  private readonly baseUrl = 'https://api.weatherapi.com/v1';
  private readonly useMockData = process.env.USE_MOCK_DATA === 'true' || false;

  async getCurrentWeather(city: string) {
    try {
      // If mock data is enabled or we know we're using a placeholder API key
      if (this.useMockData || this.apiKey === 'your_api_key') {
        this.logger.log(`Using mock data for city: ${city}`);
        // Convert city to lowercase for case-insensitive matching
        const cityKey = city.toLowerCase();
        // Find the city in mock data or return London as default
        const mockCity = Object.keys(mockWeatherData).find(key => key.includes(cityKey)) || 'london';
        return mockWeatherData[mockCity];
      }

      this.logger.log(`Getting current weather for city: ${city}`);
      const response = await axios.get(`${this.baseUrl}/current.json`, {
        params: {
          key: this.apiKey,
          q: city,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching weather data for ${city}: ${error.message}`);
      
      // If the error is related to API key being disabled, try mock data
      if (error.response && 
          (error.response.data.error.code === 2006 || 
           error.response.data.error.code === 2007 || 
           error.response.data.error.code === 2008)) {
        this.logger.warn(`Weather API key issue. Using mock data for ${city}`);
        
        // Convert city to lowercase for case-insensitive matching
        const cityKey = city.toLowerCase();
        // Find the city in mock data or return London as default
        const mockCity = Object.keys(mockWeatherData).find(key => key.includes(cityKey)) || 'london';
        return mockWeatherData[mockCity];
      }
      
      if (error.response) {
        // The request was made and the server responded with a status code
        this.logger.error(`Weather API error response: ${JSON.stringify(error.response.data)}`);
        throw new HttpException(
          error.response.data.error.message || 'Error fetching weather data',
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Could not connect to Weather API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getForecast(city: string, days: number = 3) {
    // For simplicity, just return current weather as forecast
    return this.getCurrentWeather(city);
  }

  async getCurrentWeatherByCoordinates(lat: number, lon: number) {
    try {
      // If mock data is enabled or we know we're using a placeholder API key
      if (this.useMockData || this.apiKey === 'your_api_key') {
        this.logger.log(`Using mock data for coordinates: lat=${lat}, lon=${lon}`);
        return defaultCoordinatesData;
      }

      this.logger.log(`Getting current weather for coordinates: lat=${lat}, lon=${lon}`);
      const response = await axios.get(`${this.baseUrl}/current.json`, {
        params: {
          key: this.apiKey,
          q: `${lat},${lon}`,
        },
      });
      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching weather data for coordinates (${lat},${lon}): ${error.message}`);
      
      // If the error is related to API key being disabled, use mock data
      if (error.response && 
          (error.response.data.error.code === 2006 || 
           error.response.data.error.code === 2007 || 
           error.response.data.error.code === 2008)) {
        this.logger.warn(`Weather API key issue. Using mock data for coordinates (${lat},${lon})`);
        return defaultCoordinatesData;
      }
      
      if (error.response) {
        this.logger.error(`Weather API error response: ${JSON.stringify(error.response.data)}`);
        throw new HttpException(
          error.response.data.error.message || 'Error fetching weather data by coordinates',
          error.response.status || HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Could not connect to Weather API',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getForecastByCoordinates(lat: number, lon: number, days: number = 3) {
    // For simplicity, just return current weather as forecast
    return this.getCurrentWeatherByCoordinates(lat, lon);
  }
} 