# WeatherBeats API

A NestJS-based API that provides weather data and music recommendations based on current weather conditions.

## Features

- Current weather data retrieval by city name or coordinates
- Weather forecasts for up to 10 days
- Music recommendations based on current weather conditions
- Integration with Spotify for music suggestions
- **Rate limiting** to ensure API stability and prevent abuse

## API Endpoints

### Weather Endpoints

- `GET /weather/current?city={cityName}` - Get current weather for a city
- `GET /weather/current/coordinates?lat={latitude}&lon={longitude}` - Get current weather by coordinates
- `GET /weather/music-recommendation?city={cityName}` - Get music recommendations based on weather for a city
- `GET /weather/music-recommendation/coordinates?lat={latitude}&lon={longitude}` - Get music recommendations based on weather by coordinates
- `GET /weather/health` - Health check endpoint (not rate limited)

## Rate Limiting

The API implements rate limiting to ensure stability and fair usage. Different endpoints have different rate limits:

| Endpoint Type | Limit | Time Window | Description |
|---------------|-------|-------------|-------------|
| Current Weather | 5 | 1 second | 5 requests per second |
| Music Recommendations | 10 | 10 seconds | 10 requests per 10 seconds |
| Other Endpoints | 100 | 60 seconds | 100 requests per minute |

Rate limits are applied per IP address. Exceeding the rate limit will result in a `429 Too Many Requests` response.

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables in a `.env` file:
   ```
   WEATHER_API_KEY=your_api_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   ```

4. Run the API in development mode:
   ```bash
   npm run start:dev
   ```

## Deployment

The API is deployed on [Render](https://render.com) at [https://weatherbeats.onrender.com](https://weatherbeats.onrender.com).

## License

This project is licensed under the terms of the license included in the repository. 