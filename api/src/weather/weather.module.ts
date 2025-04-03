import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { SongRecommendationService } from './song-recommendation.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, SongRecommendationService],
})
export class WeatherModule {} 