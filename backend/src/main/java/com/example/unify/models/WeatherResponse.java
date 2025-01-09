package com.example.unify.models;

import lombok.Data;

@Data
public class WeatherResponse{
    private String cityName;
    private int temperature;
    private int feelsLike;
    private int minTemperature;
    private int maxTemperature;
    private int humidity;
    private String description;
    private String icon;
    private String iconUrl;
    private int windDegree;
    private int windSpeed;
    private String sunrise;
    private String sunset;
}