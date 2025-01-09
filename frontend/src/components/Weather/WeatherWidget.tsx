import React, { useEffect, useState } from 'react';

import States from '../General/States';
import Countries from '../General/Countries';

import axios from 'axios';

interface WeatherData {
    cityName: string;
    temperature: number;
    feelsLike: number;
    minTemperature: number;
    maxTemperature: number;
    humidity: number;
    icon: string;
    iconUrl: string;
    description: string;
    windDegree: number;
    windSpeed: number;
    sunrise: string;
    sunset: string;
}

export default function WeatherComponent() {
    const [city, setCity] = useState('Valdosta');
    const [state, setState] = useState('GA');
    const [country, setCountry] = useState('US');
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDefaultWeatherData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/weather/home`
                );
                setWeatherData(response.data);
                setError('');
            } catch (err) {
                setError('Error fetching weather data.');
            }
        };

        fetchDefaultWeatherData();
    }, []);

    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/weather/city`,
                {
                    params: { city, state, country },
                }
            );
            setWeatherData(response.data);
            setError('');
        } catch (err) {
            setError('Error fetching weather data.');
        }
    };

    const fetchData = () => {
        fetchWeatherData();
    };

    const convertTo12Hour = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
    };

    return (
        <div className="relative font-sans bg-white p-4">
            {/* Weather Widget */}
            <div className="absolute top-4 left-4 border rounded-lg p-4 bg-white shadow-md w-64">
                <div className="flex flex-col gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md"
                    />
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md"
                    >
                        <option value="">Select state</option>
                        {States.map((state) => (
                            <option key={state.value} value={state.value}>
                                {state.label}
                            </option>
                        ))}
                    </select>
                    <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full p-2 text-sm border rounded-md"
                    >
                        <option value="">Select country</option>
                        {Countries.map((country) => (
                            <option key={country.value} value={country.value}>
                                {country.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={fetchData}
                        className="w-full p-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Get Weather
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {weatherData && (
                    <>
                        <h2 className="text-xl font-bold text-center mb-2">
                            {weatherData.cityName === 'Remerton'
                                ? 'Valdosta, GA'
                                : `${weatherData.cityName}, ${state}`}
                        </h2>
                        <div className="flex items-center justify-center mb-4">
                            <img
                                className="w-16 h-16 mr-4"
                                src={weatherData.iconUrl}
                                alt="Weather Icon"
                            />
                            <div className="flex flex-col">
                                <p className="text-sm font-bold mb-1">
                                    {weatherData.description}
                                </p>
                                <p className="text-2xl font-bold mb-1">
                                    {weatherData.temperature}°F
                                </p>
                                <p className="text-sm font-semibold">
                                    Feels Like: {weatherData.feelsLike}°F
                                </p>
                            </div>
                        </div>
                        <div className="text-sm text-center">
                            <p>
                                🌡️ High / Low: {weatherData.maxTemperature}° /{' '}
                                {weatherData.minTemperature}°
                            </p>
                            <p>💧 Humidity: {weatherData.humidity}%</p>
                            <p>
                                💨 Wind: {weatherData.windSpeed} mph
                                <span
                                    className="inline-block ml-1"
                                    style={{
                                        transform: `rotate(${weatherData.windDegree}deg)`,
                                    }}
                                >
                                    ➤
                                </span>
                            </p>
                            <p>
                                🌅 Sunrise:{' '}
                                {convertTo12Hour(weatherData.sunrise)}
                            </p>
                            <p>
                                🌇 Sunset: {convertTo12Hour(weatherData.sunset)}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}