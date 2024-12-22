package com.example.unify.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.unify.models.WeatherResponse;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Service
public class WeatherService {

    private final String apiKey = "cc36aeba153de37a9020de7cc0098384";
    private final String apiUrl = "https://api.openweathermap.org/data/2.5/weather";
    private final double latitude = 30.863947;
    private final double longitude = -83.377801;

    public WeatherResponse getWeatherByCoordinates() {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=imperial", apiUrl, latitude, longitude, apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseWeatherResponse(jsonResponse);
    }

    public WeatherResponse getWeatherByCity(String city, String state, String country) {
        String url = String.format("%s?q=%s,%s,%s&appid=%s&units=imperial", apiUrl, city, state, country, apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseWeatherResponse(jsonResponse);
    }

    private WeatherResponse parseWeatherResponse(String jsonResponse) {
        JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
    
        WeatherResponse response = new WeatherResponse();
        
        if (json.get("name").getAsString() == "Remerton") {
            response.setCityName("Valdosta");
        } else {
            response.setCityName(json.get("name").getAsString());
        }
    
        JsonObject main = json.getAsJsonObject("main");
        response.setTemperature(Math.round(main.get("temp").getAsDouble()));
        response.setFeelsLike(Math.round(main.get("feels_like").getAsDouble()));
        response.setMinTemperature(Math.round(main.get("temp_min").getAsDouble()));
        response.setMaxTemperature(Math.round(main.get("temp_max").getAsDouble()));

        response.setHumidity(main.get("humidity").getAsInt());
    
        JsonObject weather = json.getAsJsonArray("weather").get(0).getAsJsonObject();
        response.setWeatherDescription(weather.get("description").getAsString());
        response.setWeatherIcon(weather.get("icon").getAsString());
    
        String iconCode = weather.get("icon").getAsString();
        String iconUrl = String.format("http://openweathermap.org/img/wn/%s.png", iconCode);
        response.setWeatherIconUrl(iconUrl);

        JsonObject wind = json.getAsJsonObject("wind");
        response.setWindDegree(wind.get("deg").getAsInt());
        response.setWindSpeed(Math.round(wind.get("speed").getAsDouble()));
    
        JsonObject sys = json.getAsJsonObject("sys");
        long sunrise = sys.get("sunrise").getAsLong();
        long sunset = sys.get("sunset").getAsLong();
        response.setSunrise(convertUnixToReadableTime(sunrise));
        response.setSunset(convertUnixToReadableTime(sunset));
    
        return response;
    }
    
    private String convertUnixToReadableTime(long timestamp) {
        return Instant.ofEpochSecond(timestamp)
                      .atZone(ZoneId.systemDefault())
                      .format(DateTimeFormatter.ofPattern("HH:mm"));
    }
}