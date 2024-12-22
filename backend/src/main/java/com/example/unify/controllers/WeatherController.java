package com.example.unify.controllers;

import com.example.unify.models.WeatherResponse;
import com.example.unify.services.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/weather/city")
    public ResponseEntity<?> getWeatherbyCity(@RequestParam String city, @RequestParam String state, @RequestParam String country) {
        try {
            WeatherResponse weather = weatherService.getWeatherByCity(city, state, country);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching weather data: " + e.getMessage());
        }
    }

    @GetMapping("/weather/home")
    public ResponseEntity<?> getWeatherForHome() {
        try {
            WeatherResponse weather = weatherService.getWeatherByCoordinates();
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching weather data: " + e.getMessage());
        }
    }
}