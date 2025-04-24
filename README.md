# WeatherBeats

WeatherBeats is a full-stack application that recommends music based on current weather conditions. It integrates weather data from WeatherAPI and music recommendations from Spotify to create a unique, context-aware music suggestion service.

## Project Structure

The project consists of two main components:

- **API (Backend)** - A NestJS application that provides endpoints for weather data and music recommendations
- **Frontend** - A Next.js application that provides a user interface for interacting with the API

## API

The backend API is built with NestJS and is already deployed at:
[https://weatherbeats.onrender.com](https://weatherbeats.onrender.com)

### Features

- Current weather data retrieval by city name or coordinates
- Weather forecasts for up to 10 days
- Music recommendations based on current weather conditions
- Integration with Spotify for music suggestions

### API Documentation

For detailed information about the API endpoints and setup instructions, please see the [API README](api/README.md).

## Frontend

The frontend is built with Next.js 15, React 19, and Tailwind CSS 4, offering a modern and responsive user experience.

### Features

- Weather visualization interface
- Music recommendations based on current weather
- Responsive design for various devices
- Seamless integration with the backend API

### Frontend Documentation

For detailed information about the frontend setup and features, please check the [Frontend README](frontend/README.md).

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/WeatherBeats.git
   cd WeatherBeats
   ```

2. Set up the API (backend):
   ```bash
   cd api
   npm install
   ```

3. Configure your environment variables:
   Create a `.env` file in the `api` directory with the following:
   ```
   WEATHER_API_KEY=your_api_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   ```

4. Run the backend:
   ```bash
   npm run start:dev
   ```

5. Set up the Frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

6. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## License

This project is licensed under the terms of the license included in the repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 