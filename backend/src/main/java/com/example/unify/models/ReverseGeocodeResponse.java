package com.example.unify.models;

import lombok.Data;

@Data
public class ReverseGeocodeResponse{
    private String city;
    private String state;
    private String country;
}