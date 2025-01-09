package com.example.unify.models;

import lombok.Data;

@Data
public class WeatherAlertResponse{
    private String senderName;
    private String event;
    private String startTime;
    private String endTime;
    private String description;
}