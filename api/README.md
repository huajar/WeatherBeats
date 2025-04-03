# Weather API Backend

A simple NestJS backend for consuming the Weather API service and Spotify API for music recommendations.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure API keys:
   - Sign up for a free API key at [Weather API](https://www.weatherapi.com/)
   - Create a Spotify application at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) to get Client ID and Secret
   - Update the `.env` file with your API keys:
     ```
     WEATHER_API_KEY=your_api_key_here
     SPOTIFY_CLIENT_ID=your_spotify_client_id_here
     SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
     ```

## Running the application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run build
npm run start:prod
```

## API Endpoints

- **GET /weather/current?city=London**
  - Get current weather for a city
  - Required query parameter: `city`

- **GET /weather/forecast?city=London&days=3**
  - Get weather forecast for a city
  - Required query parameter: `city`
  - Optional query parameter: `days` (default: 3, max: 10)

- **GET /weather/current/coordinates?lat=51.5072&lon=0.1276**
  - Get current weather using latitude and longitude
  - Required query parameters: `lat` and `lon`

- **GET /weather/forecast/coordinates?lat=51.5072&lon=0.1276&days=3**
  - Get weather forecast using latitude and longitude
  - Required query parameters: `lat` and `lon`
  - Optional query parameter: `days` (default: 3, max: 10)

- **GET /weather/music-recommendation?city=London**
  - Get music recommendations from Spotify based on current weather conditions in a city
  - Required query parameter: `city`

- **GET /weather/music-recommendation/coordinates?lat=51.5072&lon=0.1276**
  - Get music recommendations from Spotify based on current weather conditions at geographic coordinates
  - Required query parameters: `lat` and `lon`

## Example Responses

### Weather Response

```json
{
  "location": {
    "name": "London",
    "region": "City of London, Greater London",
    "country": "United Kingdom",
    "lat": 51.52,
    "lon": -0.11,
    "tz_id": "Europe/London",
    "localtime_epoch": 1627930589,
    "localtime": "2021-08-02 17:36"
  },
  "current": {
    "temp_c": 19.0,
    "temp_f": 66.2,
    "condition": {
      "text": "Partly cloudy",
      "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
      "code": 1003
    },
    "wind_mph": 11.9,
    "wind_kph": 19.1,
    "humidity": 68,
    "cloud": 75,
    "feelslike_c": 19.0,
    "feelslike_f": 66.2
  }
}
```

### Music Recommendation Response (Using Spotify)

```json
{
  "weatherCondition": "Partly cloudy",
  "recommendedGenres": ["indie-rock", "pop-rock", "alternative"],
  "recommendedSongs": [
    {
      "title": "Do I Wanna Know?",
      "artist": "Arctic Monkeys",
      "album": "AM",
      "previewUrl": "https://p.scdn.co/mp3-preview/...",
      "spotifyUrl": "https://open.spotify.com/track/...",
      "imageUrl": "https://i.scdn.co/image/..."
    },
    {
      "title": "Mr. Brightside",
      "artist": "The Killers",
      "album": "Hot Fuss",
      "previewUrl": "https://p.scdn.co/mp3-preview/...",
      "spotifyUrl": "https://open.spotify.com/track/...",
      "imageUrl": "https://i.scdn.co/image/..."
    }
    // More song recommendations
  ],
  "message": "Based on the \"Partly cloudy\" weather condition, we recommend music from these genres: indie-rock, pop-rock, alternative."
}
``` 