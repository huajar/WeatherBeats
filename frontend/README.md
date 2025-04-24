# WeatherBeats Frontend

This is the WeatherBeats frontend application, developed with [Next.js](https://nextjs.org) and designed to provide music recommendations based on current weather conditions.

## Technologies Used

- **Next.js 15.3.1** - React framework for web applications
- **React 19.0.0** - Library for building user interfaces
- **Tailwind CSS 4.1.4** - CSS framework for rapid responsive design
- **Framer Motion 12.8.0** - Library for fluid animations
- **Axios 1.8.4** - HTTP client for making requests to the API

## Features

- Modern and responsive user interface
- Real-time weather data visualization
- Personalized music recommendations based on weather
- Integration with WeatherBeats API for data
- Geolocation support for automatic weather detection
- Mobile-friendly design

## Live Demo

The application is deployed and accessible on Vercel:
[https://weather-beats-seven.vercel.app](https://weather-beats-seven.vercel.app)

## Getting Started

To run the project in development mode:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

The project follows the folder and file structure of Next.js App Router:

- **src/app/** - Contains the application pages and layouts
- **src/components/** - Reusable components
- **src/lib/** - Utilities and helper functions
- **public/** - Static files

## Backend Integration

This frontend communicates with the WeatherBeats backend API to obtain weather data and music recommendations. The API is deployed at [https://weatherbeats.onrender.com](https://weatherbeats.onrender.com).

## Deployment

The frontend is deployed on [Vercel](https://vercel.com), a platform optimized for Next.js applications, offering:

- Automatic deployments triggered by pushes to the main branch
- Preview deployments for pull requests
- Fast global CDN for optimal loading times
- Seamless handling of API routes and server components
