import React, { useEffect, useState } from "react";

import "./WeatherWidget.css";
import States from "../General/States";
import Countries from "../General/Countries";

import axios from "axios";

interface WeatherData {
    cityName: string;
    temperature: number;
    feelsLike: number;
    minTemperature: number;
    maxTemperature: number;
    humidity: number;
    weatherIcon: string;
    weatherIconUrl: string;
    weatherDescription: string;
    windDegree: number;
    windSpeed: number;
    sunrise: string;
    sunset: string;
}

export default function WeatherComponent() {
    const [city, setCity] = useState("Valdosta");
    const [state, setState] = useState("GA");
    const [country, setCountry] = useState("US");
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        const fetchDefaultWeatherData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/weather/home`);
                setWeatherData(response.data);
                setError("");
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    console.error("Axios error:", err.response?.data || err.message);
                } else {
                    console.error("Unknown error:", err);
                }
                setError("Error fetching weather data.");
            }
        };

        fetchDefaultWeatherData();
    }, []);

    const fetchWeatherData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/weather/city`,
                { params: { city: city, state: state, country: country } }
            );
            setWeatherData(response.data);
            setError("");
        } catch (err) {
            setError("Error fetching weather data.");
            console.error(err);
        }
    };

    const convertTo12Hour = (time: string): string => {
        const [hours, minutes] = time.split(":").map(Number);
        const suffix = hours >= 12 ? "PM" : "AM";
        const adjustedHours = hours % 12 || 12;
        return `${adjustedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
    };

    return (
        <div className="weather-container">
            <div className="weather-widget">
                <div className="input-section">
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input-field"
                    />
                    <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="dropdown"
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
                    className="dropdown"
                    >
                        <option value="">Select country</option>
                        {Countries.map((country) => (
                            <option key={country.value} value={country.value}>
                                {country.label}
                            </option>
                        ))}
                    </select>
                    <button onClick={fetchWeatherData} className="fetch-button">
                        Get Weather
                    </button>
                </div>

                {error && <p className="error">{error}</p>}

                {weatherData && (
                    <>
                        <h2 className="city-name">{weatherData.cityName === "Remerton" ? "Valdosta, GA" : weatherData.cityName + ", " + state}</h2>
                        <div className="main-info">
                            <img
                                className="weather-icon"
                                src={weatherData.weatherIconUrl}
                                alt="Weather Icon"
                            />
                            <div className="temp-and-description">
                                <p className="description">{weatherData.weatherDescription}</p>
                                <p className="temp-large">{weatherData.temperature}°F</p>
                                <p className="temp-small">Feels Like: {weatherData.feelsLike}°F</p>
                            </div>
                        </div>
                        <div className="details">
                            <p>🌡️ High / Low: {weatherData.maxTemperature}° / {weatherData.minTemperature}°</p>
                            <p>💧 Humidity: {weatherData.humidity}%</p>
                            <p>💨 Wind: {weatherData.windSpeed} mph
                                <span
                                    className="wind-arrow"
                                    style={{ transform: `rotate(${weatherData.windDegree}deg)` }}
                                >
                                    ➤
                                </span>
                            </p>
                            <p>🌅 Sunrise: {convertTo12Hour(weatherData.sunrise)}</p>
                            <p>🌇 Sunset: {convertTo12Hour(weatherData.sunset)}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}