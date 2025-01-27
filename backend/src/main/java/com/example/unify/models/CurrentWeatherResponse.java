package com.example.unify.models;

import lombok.Data;

@Data
public class CurrentWeatherResponse {
    private String city;
    private String state;
    private String country;
    private int temperature;
    private int feelsLike;
    private int minTemperature;
    private int maxTemperature;
    private int humidity;
    private int visibility;
    private String icon;
    private String iconUrl;
    private String description;
    private int windDegree;
    private int windSpeed;
    private String sunrise;
    private String sunset;
}