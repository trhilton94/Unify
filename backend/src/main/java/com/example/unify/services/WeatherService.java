package com.example.unify.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.unify.models.WeatherResponse;
import com.example.unify.models.ForecastResponse;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class WeatherService {

    private final String apiKey = "cc36aeba153de37a9020de7cc0098384";
    private final String apiWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    private final String apiForecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
    private final double latitude = 30.863947;
    private final double longitude = -83.377801;

    public WeatherResponse getWeatherByCoordinates() {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=imperial", apiWeatherUrl, latitude, longitude, apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseWeatherResponse(jsonResponse);
    }

    public WeatherResponse getWeatherByCity(String city, String state, String country) {
        String url = String.format("%s?q=%s,%s,%s&appid=%s&units=imperial", apiWeatherUrl, city, state, country, apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseWeatherResponse(jsonResponse);
    }

    public List<ForecastResponse> getForecastByCity(String city, String state, String country) {
        String url = String.format("%s/forecast?q=%s,%s,%s&appid=%s&units=imperial", apiForecastUrl, city, state, country, apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseForecastResponse(jsonResponse);
    }

    public List<ForecastResponse> getForecastByCoordinates() {
        String url = String.format("%s/forecast?lat=%f&lon=%f&appid=%s&units=imperial", apiForecastUrl, latitude, longitude, apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseForecastResponse(jsonResponse);
    }

    private WeatherResponse parseWeatherResponse(String jsonResponse) {
        JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
    
        WeatherResponse response = new WeatherResponse();
        
        response.setCityName(json.get("name").getAsString());
    
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

    private List<ForecastResponse> parseForecastResponse(String jsonResponse) {
        JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
        JsonArray forecastList = json.getAsJsonArray("list");

        Map<String, ForecastResponse> dailyForecasts = new LinkedHashMap<>();
        for (JsonElement element : forecastList) {
            JsonObject forecastData = element.getAsJsonObject();
            String dateText = forecastData.get("dt_txt").getAsString();
            String date = dateText.split(" ")[0];

            if (!dailyForecasts.containsKey(date)) {
                JsonObject main = forecastData.getAsJsonObject("main");
                JsonObject weather = forecastData.getAsJsonArray("weather").get(0).getAsJsonObject();

                ForecastResponse forecast = new ForecastResponse();
                forecast.setDate(date);
                forecast.setDayOfWeek(getDayOfWeek(date));
                forecast.setTemp(main.get("temp").getAsDouble());
                forecast.setTempMin(main.get("temp_min").getAsDouble());
                forecast.setTempMax(main.get("temp_max").getAsDouble());
                forecast.setDescription(weather.get("description").getAsString());
                forecast.setIconUrl(String.format(
                    "http://openweathermap.org/img/wn/%s.png",
                    weather.get("icon").getAsString()
                ));

                dailyForecasts.put(date, forecast);
            }
        }

        return new ArrayList<>(dailyForecasts.values());
    }
    
    private String convertUnixToReadableTime(long timestamp) {
        return Instant.ofEpochSecond(timestamp)
                      .atZone(ZoneId.systemDefault())
                      .format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    private String getDayOfWeek(String date) {
        LocalDate localDate = LocalDate.parse(date);
        return localDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
    }
}