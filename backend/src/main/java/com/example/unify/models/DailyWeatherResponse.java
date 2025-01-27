package com.example.unify.models;

import lombok.Data;

@Data
public class DailyWeatherResponse {
    private String date;
    private String dayOfWeek;
    private String sunrise;
    private String sunset;
    private String moonrise;
    private String moonset;
    private String moonPhase;
    private int temperature;
    private int minTemperature;
    private int maxTemperature;
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