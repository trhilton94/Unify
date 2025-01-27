import React, { useEffect, useState, useRef, useCallback } from 'react';

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
    const [city, setCity] = useState('Troupville');
    const [state, setState] = useState('GA');
    const [country, setCountry] = useState('US');
    const [currentWeatherData, setCurrentWeatherData] = useState<CurrentWeatherData | null>(null);
    const [showSearchFields, setShowSearchFields] = useState(false);
    const [error, setError] = useState<string>('');

    const cityInputRef = useRef<HTMLInputElement>(null);

    const { general } = useGeneral();

    useEffect(() => {
        const fetchDefaultCurrentWeatherData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/current-weather/city`, {
                    params: { city, state, country },
                });
                setCurrentWeatherData(response.data);
                setError('');
            } catch (err) {
                console.error(err);
                setError('Error fetching weather data.');
            }
        };

        fetchDefaultCurrentWeatherData();
    }, []);

    const toggleSearchFields = () => {
        setShowSearchFields((prev) => !prev);
    };

    const fetchCurrentWeatherData = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/current-weather/city`, {
                params: { city, state, country },
            });
            setCurrentWeatherData(response.data);
            toggleSearchFields();
            setError('');
        } catch (err) {
            setError('Error fetching weather data.');
        }
    }, [city, state, country]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && document.activeElement?.tagName === 'INPUT') {
                event.preventDefault();

                if (city && state && country) {
                    fetchCurrentWeatherData();
                } else {
                    setError('Please enter a city, state, and country.');
                }
            }

            if (event.altKey && event.key.toLowerCase() === 's') {
                event.preventDefault();
                toggleSearchFields();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [fetchCurrentWeatherData]);

    useEffect(() => {
        if (showSearchFields && cityInputRef.current) {
            cityInputRef.current.focus();
        } else if (showSearchFields) {
            console.error('City input field ref is not available.');
        }
    }, [showSearchFields]);

    const convertTo12Hour = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const suffix = hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
    };

    return (
        <div className="relative font-sans p-4 transition-colors duration-300">
            <div
                className={`absolute top-4 left-4 border p-4 shadow-md w-64 transition-colors duration-300 ${
                    general.darkModeState
                        ? 'bg-[#3B3B3B] text-white border-white'
                        : 'bg-[#FFFFFF] text-black border-black'
                }`}
            >
                <div onClick={toggleSearchFields}>
                    <img
                        src="icon_search.svg"
                        alt="Search Icon"
                        className={`absolute top-5 left-3 w-6 h-6 cursor-pointer transition-colors duration-300 ${
                            general.darkModeState ? '' : 'invert'
                        }`}
                    />
                </div>
                {showSearchFields && (
                    <div className="flex flex-col gap-2 mb-4 mt-8">
                        <input
                            type="text"
                            placeholder="Enter city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            ref={cityInputRef}
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
                            className={`w-full p-2 text-sm font-semibold text-white rounded-md transition-colors duration-300 ${
                                general.darkModeState
                                    ? 'bg-emerald-500 hover:bg-emerald-600'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            Get Weather
                        </button>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm text-semibold text-center">{error}</p>}

                {currentWeatherData && (
                    <>
                        <h2 className="text-xl font-bold text-center mb-2">
                            {currentWeatherData.city === 'Remerton'
                                ? 'Valdosta, GA'
                                : `${currentWeatherData.city}, ${currentWeatherData.state}`}
                        </h2>
                        <div className="flex items-center justify-center mb-4">
                            <img
                                src={currentWeatherData.iconUrl}
                                alt="Weather Icon"
                                className={`w-16 h-16 mr-4 transition-transform duration-300 ${
                                    (general.darkModeState &&
                                        [
                                            '01n',
                                            '09d',
                                            '09n',
                                            '13d',
                                            '10d',
                                            '10n',
                                            '13n',
                                            '50d',
                                            '50n',
                                        ].includes(currentWeatherData.icon)) ||
                                    (!general.darkModeState &&
                                        ['03d', '03n', '04d', '04n', '11d', '11n'].includes(
                                            currentWeatherData.icon
                                        ))
                                        ? 'invert'
                                        : ''
                                }`}
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
                                        className={`w-5 h-5 transition-colors duration-300 ${
                                            general.darkModeState ? '' : 'invert'
                                        }`}
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
                                        className={`w-5 h-5 transition-colors duration-300 ${
                                            general.darkModeState ? '' : 'invert'
                                        }`}
                                    />
                                    <span>Humidity</span>
                                </div>
                                <span>{currentWeatherData.humidity}%</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src="icon_wind.svg"
                                        alt="Wind Icon"
                                        className={`w-5 h-5 transition-colors duration-300 ${
                                            general.darkModeState ? '' : 'invert'
                                        }`}
                                    />
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
                                        className={`w-5 h-5 transition-colors duration-300 ${
                                            general.darkModeState ? '' : 'invert'
                                        }`}
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
                                        className={`w-5 h-5 transition-colors duration-300 ${
                                            general.darkModeState ? '' : 'invert'
                                        }`}
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
                                        className={`w-5 h-5 transition-colors duration-300 ${
                                            general.darkModeState ? '' : 'invert'
                                        }`}
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
