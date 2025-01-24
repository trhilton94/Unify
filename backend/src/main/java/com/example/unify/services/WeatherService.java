package com.example.unify.services;

import com.example.unify.models.ForecastResponse;
import com.example.unify.models.CurrentWeatherResponse;
import com.example.unify.models.FullWeatherResponse;
import com.example.unify.models.ReverseGeocodeResponse;
import com.example.unify.models.ForwardGeocodeResponse;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TimeZone;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    private final String weatherAPIKey = "cc36aeba153de37a9020de7cc0098384";
    private final String apiForecastUrl = "https://api.openweathermap.org/data/2.5/forecast";
    private final String apiWeatherUrl = "https://api.openweathermap.org/data/3.0/onecall";
    private final String locationAPIKey = "pk.34a6c17d2988b52ea848a0949a11ae9f";
    private final String apiReverseGeocodeUrl = "https://us1.locationiq.com/v1/reverse";
    private final String apiForwardGeocodeUrl = "https://us1.locationiq.com/v1/search";
    private final double latitude = 30.863947;
    private final double longitude = -83.377801;

    public CurrentWeatherResponse getCurrentWeatherByCoordinates() {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=imperial", apiWeatherUrl, latitude, longitude,
                weatherAPIKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseCurrentWeatherResponse(jsonResponse);
    }

    public CurrentWeatherResponse getCurrentWeatherByCity(String city, String state, String country) {
        String url = String.format("%s?q=%s,%s,%s&appid=%s&units=imperial", apiWeatherUrl, city, state, country,
                weatherAPIKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseCurrentWeatherResponse(jsonResponse);
    }

    public List<ForecastResponse> getForecastByCity(String city, String state, String country) {
        String url = String.format("%s?q=%s,%s,%s&appid=%s&units=imperial", apiForecastUrl, city, state, country,
                weatherAPIKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseForecastResponse(jsonResponse);
    }

    public List<ForecastResponse> getForecastByCoordinates() {
        String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=imperial", apiForecastUrl, latitude, longitude,
                weatherAPIKey);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseForecastResponse(jsonResponse);
    }

    // public List<FullWeatherResponse> getFullWeatherByCity(String city, String
    // state, String country) {
    // String url = String.format("%s?q=%s,%s,%s&appid=%s&units=imperial",
    // apiWeatherUrl, city, state, country,
    // weatherAPIKey);
    // RestTemplate restTemplate = new RestTemplate();
    // String jsonResponse = restTemplate.getForObject(url, String.class);
    // return parseFullWeatherResponse(jsonResponse);
    // }

    // public List<FullWeatherResponse> getFullWeatherByCoordinates() {
    // String url = String.format("%s?lat=%f&lon=%f&appid=%s&units=imperial",
    // apiWeatherUrl, latitude, longitude,
    // weatherAPIKey);
    // RestTemplate restTemplate = new RestTemplate();
    // String jsonResponse = restTemplate.getForObject(url, String.class);
    // return parseFullWeatherResponse(jsonResponse);
    // }

    private ReverseGeocodeResponse reverseGeocode(double latitude, double longitude) {
        String url = String.format("%s?key=%s&lat=%f&lon=%f&format=json", apiReverseGeocodeUrl, locationAPIKey,
                latitude, longitude);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseReverseGeocodeResponse(jsonResponse);
    }

    private ForwardGeocodeResponse forwardGeocode(String city, String state, String country) {
        String url = String.format("%s?key=%s&city=%s&state=%s&country=%s&format=json", apiForwardGeocodeUrl,
                locationAPIKey, city, state, country);
        RestTemplate restTemplate = new RestTemplate();
        String jsonResponse = restTemplate.getForObject(url, String.class);
        return parseForwardGeocodeResponse(jsonResponse);
    }

    private CurrentWeatherResponse parseCurrentWeatherResponse(String jsonResponse) {
        JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
        CurrentWeatherResponse currentWeatherResponse = new CurrentWeatherResponse();

        double latitude = json.get("lat").getAsDouble();
        double longitude = json.get("lon").getAsDouble();
        ReverseGeocodeResponse reverseGeocodeResponse = reverseGeocode(latitude, longitude);
        currentWeatherResponse.setCity(reverseGeocodeResponse.getCity());
        currentWeatherResponse.setState(reverseGeocodeResponse.getState());
        currentWeatherResponse.setCountry(reverseGeocodeResponse.getCountry());

        int timezoneOffset = json.get("timezone_offset").getAsInt();

        JsonObject current = json.getAsJsonObject("current");

        currentWeatherResponse.setTemperature((int) Math.round(current.get("temp").getAsDouble()));
        currentWeatherResponse.setFeelsLike((int) Math.round(current.get("feels_like").getAsDouble()));
        currentWeatherResponse.setHumidity(current.get("humidity").getAsInt());
        currentWeatherResponse.setVisibility(current.get("visibility").getAsInt() / 1000);
        currentWeatherResponse
                .setSunrise(convertUnixToReadableTime(current.get("sunrise").getAsLong(), timezoneOffset));
        currentWeatherResponse.setSunset(convertUnixToReadableTime(current.get("sunset").getAsLong(), timezoneOffset));
        currentWeatherResponse.setWindDegree(current.get("wind_deg").getAsInt());
        currentWeatherResponse.setWindSpeed((int) Math.round(current.get("wind_speed").getAsDouble()));

        JsonObject daily = json.getAsJsonArray("daily").get(0).getAsJsonObject();
        JsonObject temps = daily.getAsJsonObject("temp");
        currentWeatherResponse.setMinTemperature((int) Math.round(temps.get("min").getAsDouble()));

        long currentUnixTime = current.get("dt").getAsLong();
        int currentHour = getHourFromUnix(currentUnixTime, timezoneOffset);

        if (currentHour < 18) {
            currentWeatherResponse.setMaxTemperature((int) Math.round(temps.get("max").getAsDouble()));
        } else {
            currentWeatherResponse.setMaxTemperature(-1);
        }

        JsonObject weather = current.getAsJsonArray("weather").get(0).getAsJsonObject();
        String description = weather.get("description").getAsString();
        String capitalizedDescription = Arrays.stream(description.split(" "))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1)).collect(Collectors.joining(" "));
        currentWeatherResponse.setDescription(capitalizedDescription);

        currentWeatherResponse.setIcon(weather.get("icon").getAsString());

        String iconCode = weather.get("icon").getAsString();
        String iconUrl = String.format("http://openweathermap.org/img/wn/%s.png", iconCode);
        currentWeatherResponse.setIconUrl(iconUrl);

        return currentWeatherResponse;
    }

    // private FullWeatherResponse parseFullWeatherResponse(String jsonResponse) {

    // }

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

    private ReverseGeocodeResponse parseReverseGeocodeResponse(String jsonResponse) {
        JsonObject json = JsonParser.parseString(jsonResponse).getAsJsonObject();
        ReverseGeocodeResponse reverseGeocodeResponse = new ReverseGeocodeResponse();
        JsonObject address = json.getAsJsonObject("address");
        reverseGeocodeResponse.setCity(address.get("city").getAsString());
        reverseGeocodeResponse.setState(address.get("state").getAsString());
        reverseGeocodeResponse.setCountry(address.get("country").getAsString());
        return reverseGeocodeResponse;
    }

    private ForwardGeocodeResponse parseForwardGeocodeResponse(String jsonResponse) {
        JsonArray jsonArray = JsonParser.parseString(jsonResponse).getAsJsonArray();
        ForwardGeocodeResponse forwardGeocodeResponse = new ForwardGeocodeResponse();
        JsonObject json = jsonArray.get(1).getAsJsonObject();
        forwardGeocodeResponse.setLatitude(json.get("lat").getAsInt());
        forwardGeocodeResponse.setLongitude(json.get("lon").getAsInt());
        return forwardGeocodeResponse;
    }

    private String convertUnixToReadableTime(long timestamp, int timezoneOffset) {
        return Instant.ofEpochSecond(timestamp + timezoneOffset).atZone(ZoneOffset.UTC)
                .format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    private String getDayOfWeek(String date) {
        LocalDate localDate = LocalDate.parse(date);
        return localDate.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
    }

    private int getHourFromUnix(long unixTimestamp, int timezoneOffset) {
        long adjustedTime = unixTimestamp + timezoneOffset;
        Date date = new Date(adjustedTime * 1000L);
        SimpleDateFormat formatter = new SimpleDateFormat("H");
        formatter.setTimeZone(TimeZone.getTimeZone("UTC"));
        return Integer.parseInt(formatter.format(date));
    }
}