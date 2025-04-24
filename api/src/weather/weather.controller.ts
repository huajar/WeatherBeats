import { Controller, Get, Query, ValidationPipe, ParseFloatPipe, Logger, HttpException, HttpStatus, Catch, Param, UseGuards } from '@nestjs/common';
import { Throttle, SkipThrottle, ThrottlerGuard } from '@nestjs/throttler';
import { WeatherService } from './weather.service';
import { SongRecommendationService } from './song-recommendation.service';

@Controller('weather')
export class WeatherController {
  private readonly logger = new Logger(WeatherController.name);

  constructor(
    private readonly weatherService: WeatherService,
    private readonly songRecommendationService: SongRecommendationService,
  ) {}

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @Get('current')
  async getCurrentWeather(@Query('city') city: string) {
    if (!city) {
      return { error: 'City parameter is required' };
    }
    return this.weatherService.getCurrentWeather(city);
  }

  @Get('forecast')
  async getForecast(
    @Query('city') city: string,
    @Query('days') days: number = 3,
  ) {
    if (!city) {
      return { error: 'City parameter is required' };
    }
    return this.weatherService.getForecast(city, days);
  }

  @Throttle({ short: { limit: 5, ttl: 1000 } })
  @Get('current/coordinates')
  async getCurrentWeatherByCoordinates(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
  ) {
    if (lat === undefined || lon === undefined) {
      return { error: 'Latitude and longitude parameters are required' };
    }
    return this.weatherService.getCurrentWeatherByCoordinates(lat, lon);
  }

  @Get('forecast/coordinates')
  async getForecastByCoordinates(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
    @Query('days') days: number = 3,
  ) {
    if (lat === undefined || lon === undefined) {
      return { error: 'Latitude and longitude parameters are required' };
    }
    return this.weatherService.getForecastByCoordinates(lat, lon, days);
  }

  @Throttle({ medium: { limit: 10, ttl: 10000 } })
  @Get('music-recommendation')
  async getMusicRecommendation(@Query('city') city: string) {
    try {
      this.logger.log(`Getting music recommendation for city: ${city}`);
      
      if (!city) {
        return { error: 'City parameter is required' };
      }
      
      // Get current weather data
      const weatherData = await this.weatherService.getCurrentWeather(city);
      
      // Extract the weather condition text
      const condition = weatherData.current.condition.text;
      this.logger.log(`Weather condition for ${city}: ${condition}`);
      
      // Get song recommendations based on the condition
      return this.songRecommendationService.getRecommendationsByCondition(condition);
    } catch (error) {
      this.logger.error(`Error getting music recommendation for city ${city}: ${error.message}`, error.stack);
      
      if (error.response && error.response.data && error.response.data.error) {
        this.logger.error(`Weather API Error: ${JSON.stringify(error.response.data.error)}`);
        
        if (error.response.data.error.code === 1006) {
          throw new HttpException('City not found', HttpStatus.NOT_FOUND);
        } else if (error.response.data.error.code === 2006 || error.response.data.error.code === 2007 || error.response.data.error.code === 2008) {
          throw new HttpException('Weather API key has been disabled or is invalid', HttpStatus.FORBIDDEN);
        }
      }
      
      throw new HttpException(
        'Failed to get music recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Throttle({ medium: { limit: 10, ttl: 10000 } })
  @Get('music-recommendation/coordinates')
  async getMusicRecommendationByCoordinates(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lon', ParseFloatPipe) lon: number,
  ) {
    try {
      this.logger.log(`Getting music recommendation for coordinates: lat=${lat}, lon=${lon}`);
      
      if (lat === undefined || lon === undefined) {
        return { error: 'Latitude and longitude parameters are required' };
      }
      
      // Get current weather data by coordinates
      const weatherData = await this.weatherService.getCurrentWeatherByCoordinates(lat, lon);
      
      // Extract the weather condition text
      const condition = weatherData.current.condition.text;
      this.logger.log(`Weather condition for coordinates (${lat},${lon}): ${condition}`);
      
      // Get song recommendations based on the condition
      return this.songRecommendationService.getRecommendationsByCondition(condition);
    } catch (error) {
      this.logger.error(`Error getting music recommendation for coordinates (${lat},${lon}): ${error.message}`, error.stack);
      
      if (error.response && error.response.data && error.response.data.error) {
        this.logger.error(`Weather API Error: ${JSON.stringify(error.response.data.error)}`);
        
        if (error.response.data.error.code === 1006) {
          throw new HttpException('Invalid coordinates', HttpStatus.BAD_REQUEST);
        } else if (error.response.data.error.code === 2006 || error.response.data.error.code === 2007 || error.response.data.error.code === 2008) {
          throw new HttpException('Weather API key has been disabled or is invalid', HttpStatus.FORBIDDEN);
        }
      }
      
      throw new HttpException(
        'Failed to get music recommendations',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @SkipThrottle()
  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }
} 