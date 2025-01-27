package com.example.unify.controllers;

import com.example.unify.models.CurrentWeatherResponse;
import com.example.unify.models.FullWeatherResponse;
import com.example.unify.services.WeatherService;
import java.util.List;
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

    @GetMapping("/current-weather/city")
    public ResponseEntity<?> getCurrentWeatherbyCity(@RequestParam String city, @RequestParam String state,
            @RequestParam String country) {
        try {
            CurrentWeatherResponse weather = weatherService.getCurrentWeatherByCity(city, state, country);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching weather data: " + e.getMessage());
        }
    }

    @GetMapping("/current-weather/home")
    public ResponseEntity<?> getCurrentWeatherForHome() {
        try {
            CurrentWeatherResponse weather = weatherService.getCurrentWeatherByCoordinates();
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching weather data: " + e.getMessage());
        }
    }

    @GetMapping("/full-weather/city")
    public ResponseEntity<?> getFullWeatherByCity(@RequestParam String city,
            @RequestParam String state,
            @RequestParam String country) {
        try {
            List<FullWeatherResponse> weatherAlerts = weatherService.getFullWeatherByCity(city, state, country);
            return ResponseEntity.ok(weatherAlerts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching weather alert data: " + e.getMessage());
        }
    }

    @GetMapping("/full-weather/home")
    public ResponseEntity<?> getFullWeatherForHome() {
        try {
            List<FullWeatherResponse> weatherAlerts = weatherService.getFullWeatherByCoordinates();
            return ResponseEntity.ok(weatherAlerts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error fetching weather alert data: " + e.getMessage());
        }
    }
}