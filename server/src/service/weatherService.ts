import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string; // Optional state field
}

class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '5be48739f82bb8b6c2924b9bc06cb4fb';
  }

  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(`${this.baseURL}/data/2.5/weather?q=${encodeURIComponent(query)}&appid=${this.apiKey}`);

      if (!response.ok) {
        throw new Error(`Error fetching location data: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to fetch location data:", error);
      return null;
    }
  }

  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon, name, country, state = '' } = locationData.coord || {}; // Ensure "coord" exists, default empty state
    return { lat, lon, name, country, state };
  }

  private buildGeocodeQuery(city: string, state?: string, country?: string): string {
    return [city, state, country].filter(Boolean).join(', ');
  }

  // private buildWeatherQuery(coordinates: Coordinates): string {
  //   return `${coordinates.lat},${coordinates.lon}`;
  // }

  public async getWeatherForCity(city: string, coordinates: Coordinates): Promise<Weather | null> {
    try {
      const locationData = await this.fetchLocationData(this.buildGeocodeQuery(city, coordinates.state, coordinates.country));

      if (!locationData) return null;

      const coords = this.destructureLocationData(locationData);
      return await this.fetchWeatherData(coords);
    } catch (error) {
      console.error("Error in fetchAndDestructureLocationData:", error);
      return null;
    }
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather | null> {
    try {
      const response = await fetch(`${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`);

      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }

      const weatherData: any = await response.json();
      if (!weatherData) {
        console.error("No weather data found.");
        return null;
      }

      const weather = new Weather(
        weatherData.name,
        dayjs(weatherData.dt * 1000), // Convert Unix timestamp to Dayjs object
        weatherData.main.temp,
        weatherData.wind.speed,
        weatherData.main.humidity,
        weatherData.weather[0].icon,
        weatherData.weather[0].description
      );

      return weather;
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      return null;
    }
  }
}

export default new WeatherService();