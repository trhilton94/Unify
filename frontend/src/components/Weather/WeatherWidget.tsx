import React, { useEffect, useState } from 'react';

import States from '../../utils/States';
import Countries from '../../utils/Countries';

import { useGeneral } from 'contexts/GeneralProvider';

import axios from 'axios';

interface CurrentWeatherData {
    city: string;
    state: string;
    country: string;
    temperature: number;
    feelsLike: number;
    minTemperature: number;
    maxTemperature: number;
    humidity: number;
    visibility: number;
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
    const [currentWeatherData, setCurrentWeatherData] = useState<CurrentWeatherData | null>(null);
    const [error, setError] = useState<string>('');

    const { general } = useGeneral();

    useEffect(() => {
        const fetchDefaultCurrentWeatherData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/current-weather/home`);
                setCurrentWeatherData(response.data);
                setError('');
            } catch (err) {
                setError('Error fetching weather data.');
            }
        };

        fetchDefaultCurrentWeatherData();
    }, []);

    const fetchCurrentWeatherData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/current-weather/city`, {
                params: { city, state, country },
            });
            setCurrentWeatherData(response.data);
            setError('');
        } catch (err) {
            setError('Error fetching weather data.');
        }
    };

    const convertTo12Hour = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
    };

    return (
        <div className="relative font-sans p-4">
            {/* Weather Widget */}
            <div
                className={`absolute top-4 left-4 border p-4 shadow-md w-64 transition-colors duration-300 ${
                    general.darkModeState
                        ? 'bg-[#3B3B3B] text-white border-white'
                        : 'bg-[#FFFFFF] text-black border-black'
                }`}
            >
                <div className="flex flex-col gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`w-full p-2 text-sm text-semibold border rounded-md transition-colors duration-300 ${
                            general.darkModeState
                                ? 'bg-[#4C4C4C] text-white'
                                : 'bg-[#FFFFFF] text-black'
                        }`}
                    />
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className={`w-full p-2 text-sm text-semibold border rounded-md transition-colors duration-300 ${
                            general.darkModeState
                                ? 'bg-[#4C4C4C] text-white'
                                : 'bg-[#FFFFFF] text-black'
                        }`}
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
                        className={`w-full p-2 text-sm text-semibold border rounded-md transition-colors duration-300 ${
                            general.darkModeState
                                ? 'bg-[#4C4C4C] text-white'
                                : 'bg-[#FFFFFF] text-black'
                        }`}
                    >
                        <option value="">Select country</option>
                        {Countries.map((country) => (
                            <option key={country.value} value={country.value}>
                                {country.label}
                            </option>
                        ))}
                    </select>
                    <button
                        onClick={fetchCurrentWeatherData}
                        className="w-full p-2 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                    >
                        Get Weather
                    </button>
                </div>

                {error && <p className="text-red-500 text-sm text-semibold">{error}</p>}

                {currentWeatherData && (
                    <>
                        <h2 className="text-xl font-bold text-center mb-2">
                            {currentWeatherData.city === 'Remerton'
                                ? 'Valdosta, GA'
                                : `${currentWeatherData.city}, ${currentWeatherData.state}`}
                        </h2>
                        <div className="flex items-center justify-center mb-4">
                            <img
                                className="w-16 h-16 mr-4"
                                src={currentWeatherData.iconUrl}
                                alt="Weather Icon"
                            />
                            <div className="flex flex-col">
                                <p className="text-sm font-bold mb-1">
                                    {currentWeatherData.description}
                                </p>
                                <p className="text-2xl font-bold mb-1">
                                    {currentWeatherData.temperature}°F
                                </p>
                                <p className="text-sm font-semibold">
                                    Feels Like: {currentWeatherData.feelsLike}°F
                                </p>
                            </div>
                        </div>
                        <div className="text-sm font-semibold">
                            <div className="flex justify-between py-2">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="icon_temp.svg"
                                        alt="Temperature Icon"
                                        className="w-5 h-5"
                                    />
                                    <span>High / Low</span>
                                </div>
                                <span>
                                    {currentWeatherData.maxTemperature === -1
                                        ? '--'
                                        : `${currentWeatherData.maxTemperature}°`}{' '}
                                    / {currentWeatherData.minTemperature}°
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="icon_humidity.svg"
                                        alt="Humidity Icon"
                                        className="w-5 h-5"
                                    />
                                    <span>Humidity</span>
                                </div>
                                <span>{currentWeatherData.humidity}%</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center space-x-2">
                                    <img src="icon_wind.svg" alt="Wind Icon" className="w-5 h-5" />
                                    <span>Wind</span>
                                </div>
                                <span>
                                    {currentWeatherData.windSpeed} mph{' '}
                                    <span
                                        style={{
                                            transform: `rotate(${currentWeatherData.windDegree}deg)`,
                                        }}
                                    >
                                        ➤
                                    </span>
                                </span>
                            </div>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="icon_visibility.svg"
                                        alt="Visibility Icon"
                                        className="w-5 h-5"
                                    />
                                    <span>Visibility</span>
                                </div>
                                <span>{currentWeatherData.visibility} mi</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="icon_sunrise.svg"
                                        alt="Sunrise Icon"
                                        className="w-5 h-5"
                                    />
                                    <span>Sunrise</span>
                                </div>
                                <span>{convertTo12Hour(currentWeatherData.sunrise)}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="icon_sunset.svg"
                                        alt="Sunset Icon"
                                        className="w-5 h-5"
                                    />
                                    <span>Sunset</span>
                                </div>
                                <span>{convertTo12Hour(currentWeatherData.sunset)}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
