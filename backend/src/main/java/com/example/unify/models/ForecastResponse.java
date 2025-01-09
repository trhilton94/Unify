package com.example.unify.models;

import lombok.Data;

@Data
public class ForecastResponse{
    private String date;
    private String dayOfWeek;
    private int tempMin;
    private int tempMax;
    private int precipitationChance;
    private int windSpeed;
    private String description;
    private String iconUrl;
}