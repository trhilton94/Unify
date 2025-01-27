package com.example.unify.models;

import java.util.List;

import lombok.Data;

@Data
public class FullWeatherResponse {
    private CurrentWeatherResponse currentWeather;
    private List<HourlyWeatherResponse> hourlyWeather;
    private List<DailyWeatherResponse> dailyWeather;
    private List<WeatherAlertResponse> weatherAlerts;
}