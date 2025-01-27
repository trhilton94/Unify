package com.example.unify.models;

import lombok.Data;

@Data
public class HourlyWeatherResponse {
    private String date;
    private String time;
    private String dayOfWeek;
    private int temperature;
    private int feelsLike;
    private int humidity;
    private int visibility;
    private int windDegree;
    private int windSpeed;
    private int windGust;
    private int precipitationChance;
    private String icon;
    private String iconUrl;
    private String description;
}