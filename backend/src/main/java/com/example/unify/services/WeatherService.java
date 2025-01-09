package com.example.unify.services;

import com.example.unify.models.ForecastResponse;
import com.example.unify.models.WeatherAlertResponse;
import com.example.unify.models.WeatherResponse;
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
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService{

    private final String apiKey = "cc36aeba153de37a9020de7cc0098384";
    private final String apiWeatherUrl = "https://api.openweathermap.org/data/2.5/weather";
    private final String apiForecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
    private final String apiWeatherAlertsUrl = "https://api.openweathermap.org/data/3.0/onecall";
    private final double latitude = 30.863947;
    private final double longitude = -83.377801;

    public WeatherResponse getWeatherByCoordinates() {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=imperial", apiWeatherUrl, latitude, longitude,
                apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseWeatherResponse(jsonResponse);
    }

    public WeatherResponse getWeatherByCity(String city, String state, String country) {
        String url = String.format("%s?q=%s,%s,%s&appid=%s&units=imperial", apiWeatherUrl, city, state, country,
                apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseWeatherResponse(jsonResponse);
    }

    public List<ForecastResponse> getForecastByCity(String city, String state, String country) {
        String url = String.format("%s?q=%s,%s,%s&appid=%s&units=imperial", apiForecastUrl, city, state, country,
                apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseForecastResponse(jsonResponse);
    }

    public List<ForecastResponse> getForecastByCoordinates() {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=imperial", apiForecastUrl, latitude, longitude,
                apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseForecastResponse(jsonResponse);
    }

    public List<WeatherAlertResponse> getWeatherAlertsByCity(String city, String state, String country) {
        String url = String.format("%s?q=%s,%s,%s&appid=%s&units=imperial", apiWeatherAlertsUrl, city, state, country,
                apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseWeatherAlertResponse(jsonResponse);
    }

    public List<WeatherAlertResponse> getWeatherAlertsByCoordinates() {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=imperial", apiWeatherAlertsUrl, latitude, longitude,
                apiKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseWeatherAlertResponse(jsonResponse);
    }

    private WeatherResponse parseWeatherResponse(String jsonResponse) {
        JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();

        WeatherResponse weatherResponse = new WeatherResponse();

        weatherResponse.setCityName(json.get("name").getAsString());

        JsonObject main = json.getAsJsonObject("main");
        weatherResponse.setTemperature((int) Math.round(main.get("temp").getAsDouble()));
        weatherResponse.setFeelsLike((int) Math.round(main.get("feels_like").getAsDouble()));
        weatherResponse.setMinTemperature((int) Math.round(main.get("temp_min").getAsDouble()));
        weatherResponse.setMaxTemperature((int) Math.round(main.get("temp_max").getAsDouble()));

        weatherResponse.setHumidity(main.get("humidity").getAsInt());

        JsonObject weather = json.getAsJsonArray("weather").get(0).getAsJsonObject();

        String description = weather.get("description").getAsString();
        String capitalizedDescription = Arrays.stream(description.split(" "))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1)).collect(Collectors.joining(" "));
        weatherResponse.setDescription(capitalizedDescription);

        weatherResponse.setIcon(weather.get("icon").getAsString());

        String iconCode = weather.get("icon").getAsString();
        String iconUrl = String.format("http://openweathermap.org/img/wn/%s.png", iconCode);
        weatherResponse.setIconUrl(iconUrl);

        JsonObject wind = json.getAsJsonObject("wind");
        weatherResponse.setWindDegree(wind.get("deg").getAsInt());
        weatherResponse.setWindSpeed((int) Math.round(wind.get("speed").getAsDouble()));

        JsonObject sys = json.getAsJsonObject("sys");
        long sunrise = sys.get("sunrise").getAsLong();
        long sunset = sys.get("sunset").getAsLong();
        weatherResponse.setSunrise(convertUnixToReadableTime(sunrise));
        weatherResponse.setSunset(convertUnixToReadableTime(sunset));

        return weatherResponse;
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

                ForecastResponse forecastResponse = new ForecastResponse();
                forecastResponse.setDate(date);
                forecastResponse.setDayOfWeek(getDayOfWeek(date));
                forecastResponse.setTempMin((int) Math.round(main.get("temp_min").getAsDouble()));
                forecastResponse.setTempMax((int) Math.round(main.get("temp_max").getAsDouble()));

                forecastResponse.setPrecipitationChance(
                        forecastData.has("pop") ? (int) Math.round(forecastData.get("pop").getAsDouble() * 100) : 0);

                forecastResponse.setWindSpeed(forecastData.has("wind_speed")
                        ? (int) Math.round(forecastData.get("wind_speed").getAsDouble())
                        : 0);

                String description = weather.get("description").getAsString();
                String capitalizedDescription = Arrays.stream(description.split(" "))
                        .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1))
                        .collect(Collectors.joining(" "));
                forecastResponse.setDescription(capitalizedDescription);

                forecastResponse.setIconUrl(
                        String.format("http://openweathermap.org/img/wn/%s.png", weather.get("icon").getAsString()));

                dailyForecasts.put(date, forecastResponse);
            }
        }

        return new ArrayList<>(dailyForecasts.values());
    }

    private List<WeatherAlertResponse> parseWeatherAlertResponse(String jsonResponse) {
        JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
        JsonArray alerts = json.has("alerts") ? json.getAsJsonArray("alerts") : new JsonArray();

        List<WeatherAlertResponse> weatherAlertResponses = new ArrayList<>();

        for (JsonElement alertElement : alerts) {
            JsonObject alertObject = alertElement.getAsJsonObject();
            WeatherAlertResponse weatherAlertResponse = new WeatherAlertResponse();

            weatherAlertResponse.setSenderName(alertObject.get("sender_name").getAsString());
            weatherAlertResponse.setEvent(alertObject.get("event").getAsString());
            weatherAlertResponse.setStartTime(convertUnixToReadableTime(alertObject.get("start").getAsInt()));
            weatherAlertResponse.setEndTime(convertUnixToReadableTime(alertObject.get("end").getAsInt()));
            weatherAlertResponse.setDescription(alertObject.get("description").getAsString());

            weatherAlertResponses.add(weatherAlertResponse);
        }

        return weatherAlertResponses;
    }

    private String convertUnixToReadableTime(long timestamp) {
        return Instant.ofEpochSecond(timestamp).atZone(ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    private String getDayOfWeek(String date) {
        LocalDate localDate = LocalDate.parse(date);
        return localDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
    }

}