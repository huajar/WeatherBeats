// Mock weather data to use as fallback when Weather API is not available
export const mockWeatherData = {
  london: {
    location: {
      name: 'London',
      region: 'City of London, Greater London',
      country: 'United Kingdom',
      lat: 51.52,
      lon: -0.11,
      tz_id: 'Europe/London',
      localtime_epoch: 1627930589,
      localtime: '2021-08-02 17:36'
    },
    current: {
      temp_c: 19.0,
      temp_f: 66.2,
      condition: {
        text: 'Partly cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        code: 1003
      },
      wind_mph: 11.9,
      wind_kph: 19.1,
      humidity: 68,
      cloud: 75,
      feelslike_c: 19.0,
      feelslike_f: 66.2
    }
  },
  newYork: {
    location: {
      name: 'New York',
      region: 'New York',
      country: 'United States of America',
      lat: 40.71,
      lon: -74.01,
      tz_id: 'America/New_York',
      localtime_epoch: 1627930589,
      localtime: '2021-08-02 12:36'
    },
    current: {
      temp_c: 24.0,
      temp_f: 75.2,
      condition: {
        text: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        code: 1000
      },
      wind_mph: 8.1,
      wind_kph: 13.0,
      humidity: 55,
      cloud: 10,
      feelslike_c: 25.1,
      feelslike_f: 77.2
    }
  },
  tokyo: {
    location: {
      name: 'Tokyo',
      region: 'Tokyo',
      country: 'Japan',
      lat: 35.69,
      lon: 139.69,
      tz_id: 'Asia/Tokyo',
      localtime_epoch: 1627930589,
      localtime: '2021-08-03 01:36'
    },
    current: {
      temp_c: 28.0,
      temp_f: 82.4,
      condition: {
        text: 'Clear',
        icon: '//cdn.weatherapi.com/weather/64x64/night/113.png',
        code: 1000
      },
      wind_mph: 5.6,
      wind_kph: 9.0,
      humidity: 70,
      cloud: 5,
      feelslike_c: 31.2,
      feelslike_f: 88.2
    }
  },
  paris: {
    location: {
      name: 'Paris',
      region: 'Ile-de-France',
      country: 'France',
      lat: 48.87,
      lon: 2.33,
      tz_id: 'Europe/Paris',
      localtime_epoch: 1627930589,
      localtime: '2021-08-02 18:36'
    },
    current: {
      temp_c: 22.0,
      temp_f: 71.6,
      condition: {
        text: 'Light rain',
        icon: '//cdn.weatherapi.com/weather/64x64/day/296.png',
        code: 1183
      },
      wind_mph: 6.9,
      wind_kph: 11.2,
      humidity: 78,
      cloud: 85,
      feelslike_c: 22.0,
      feelslike_f: 71.6
    }
  },
  sydney: {
    location: {
      name: 'Sydney',
      region: 'New South Wales',
      country: 'Australia',
      lat: -33.87,
      lon: 151.21,
      tz_id: 'Australia/Sydney',
      localtime_epoch: 1627930589,
      localtime: '2021-08-03 02:36'
    },
    current: {
      temp_c: 12.0,
      temp_f: 53.6,
      condition: {
        text: 'Heavy rain',
        icon: '//cdn.weatherapi.com/weather/64x64/night/308.png',
        code: 1195
      },
      wind_mph: 9.4,
      wind_kph: 15.1,
      humidity: 88,
      cloud: 100,
      feelslike_c: 10.3,
      feelslike_f: 50.5
    }
  }
};

// Default coordinates data (London)
export const defaultCoordinatesData = {
  location: {
    name: 'London',
    region: 'City of London, Greater London',
    country: 'United Kingdom',
    lat: 51.52,
    lon: -0.11,
    tz_id: 'Europe/London',
    localtime_epoch: 1627930589,
    localtime: '2021-08-02 17:36'
  },
  current: {
    temp_c: 19.0,
    temp_f: 66.2,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
      code: 1003
    },
    wind_mph: 11.9,
    wind_kph: 19.1,
    humidity: 68,
    cloud: 75,
    feelslike_c: 19.0,
    feelslike_f: 66.2
  }
}; 