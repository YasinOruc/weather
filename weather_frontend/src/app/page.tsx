'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Cloud,
  Droplet,
  Wind,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Thermometer,
  BarChart2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from '../utils/axiosConfig';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  feels_like: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  sunrise: string;
  sunset: string;
  forecast: ForecastDay[];
  hourlyForecast: HourlyForecast[];
}

interface ForecastDay {
  day: string;
  icon: string;
  maxTemp: number;
  minTemp: number;
}

interface HourlyForecast {
  time: string;
  temp: number;
}

const iconMap = {
  '01': (size: number) => <Sun size={size} className="text-yellow-500" />,
  '02': (size: number) => <Cloud size={size} className="text-gray-400" />,
  '03': (size: number) => <Cloud size={size} className="text-gray-500" />,
  '04': (size: number) => <Cloud size={size} className="text-gray-500" />,
  '09': (size: number) => <Cloud size={size} className="text-blue-500" />,
  '10': (size: number) => <Cloud size={size} className="text-blue-500" />,
  '11': (size: number) => <Cloud size={size} className="text-purple-500" />,
  '13': (size: number) => <Cloud size={size} className="text-gray-300" />,
  '50': (size: number) => <Cloud size={size} className="text-gray-400" />,
};

const WeatherIcon = ({ icon, size = 24 }: { icon: string; size?: number }) => {
  const iconCode = icon.slice(0, 2);
  const IconComponent = iconMap[iconCode as keyof typeof iconMap];
  return IconComponent ? IconComponent(size) : <Cloud size={size} className="text-gray-400" />;
};

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get<WeatherData>('weather/', { params: { city } });
      setWeatherData(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Stad niet gevonden. Probeer het opnieuw.');
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900' : 'bg-gray-100'
      } text-gray-900 dark:text-gray-100 transition-colors duration-300`}
    >
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center">
            <Cloud className="mr-2" /> Yasin Oruc
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={darkMode ? 'Schakel over naar lichte modus' : 'Schakel over naar donkere modus'}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        <form onSubmit={handleSearch} className="flex space-x-2 mb-8">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Voer een stadsnaam in"
            className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Stadsnaam"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Zoeken"
          >
            <Search size={20} />
          </button>
        </form>

        {errorMessage && (
          <div className="mb-4 text-red-500 bg-red-100 dark:bg-red-900 p-3 rounded-lg">
            {errorMessage}
          </div>
        )}

        {weatherData && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{weatherData.city}</h2>
                <WeatherIcon icon={weatherData.icon} size={48} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-4xl font-bold">{Math.round(weatherData.temperature)}°C</p>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {weatherData.description}
                  </p>
                  <div className="flex items-center mt-2">
                    <Thermometer size={20} className="mr-2 text-red-500" />
                    <span>Gevoelstemperatuur: {Math.round(weatherData.feels_like)}°C</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      icon: <Droplet size={20} className="text-blue-500" />,
                      label: `${weatherData.humidity}% Vochtigheid`,
                    },
                    {
                      icon: <Wind size={20} className="text-blue-500" />,
                      label: `${weatherData.windSpeed} m/s Wind`,
                    },
                    {
                      icon: <BarChart2 size={20} className="text-green-500" />,
                      label: `Luchtdruk: ${weatherData.pressure} hPa`,
                    },
                    {
                      icon: <Sunrise size={20} className="text-orange-500" />,
                      label: `Zonsopgang: ${weatherData.sunrise}`,
                    },
                    {
                      icon: <Sunset size={20} className="text-orange-500" />,
                      label: `Zonsondergang: ${weatherData.sunset}`,
                    },
                  ].map(({ icon, label }, index) => (
                    <div key={index} className="flex items-center">
                      {icon}
                      <span className="ml-2">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">5-daagse Voorspelling</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {weatherData.forecast.map((day) => (
                  <div
                    key={day.day}
                    className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <p className="font-semibold">{day.day}</p>
                    <WeatherIcon icon={day.icon} size={32} />
                    <p className="text-sm">
                      <span className="text-red-500">{Math.round(day.maxTemp)}°</span>{' '}
                      <span className="text-blue-500">{Math.round(day.minTemp)}°</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Temperatuurtrend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weatherData.hourlyForecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `${Math.round(value)}°C`}
                    labelFormatter={(label: string) => `Tijd: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
