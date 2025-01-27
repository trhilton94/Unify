package com.example.unify.models;

import lombok.Data;

@Data
public class WeatherAlertResponse {
    private String sender;
    private String event;
    private String description;
    private String severity;
    private String startDate;
    private String startTime;
    private String endDate;
    private String endTime;
}