package pwr.inf.ziwg.chatbot.service;

import pwr.inf.ziwg.chatbot.exceptions.weatherAPI.DataParseException;
import pwr.inf.ziwg.chatbot.exceptions.weatherAPI.ReadJSONException;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import static pwr.inf.ziwg.chatbot.util.JSONReader.readJsonFromUrl;

@Service
public class ExternalAPIService {

    public Map<String, String> getQRFromApi(Map<String, String> params) {
        String base = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=";
        String message = params.get("qr_text");

        Map<String, String> responseData = new HashMap<>();
        responseData.put("url", base+message);
        return responseData;
    }

    public Map<String, String> getBtcFromApi(Map<String, String> params) {
        String base = "https://www.bitstamp.net/api/ticker/";
        String message = params.get("message");



        JSONObject response = new JSONObject();
        try {
            response = readJsonFromUrl(base);
            System.out.println(response);
        } catch (JSONException | IOException e) {
            throw new ReadJSONException("Cannot get JSON from URL 1'" + base + "'.");
        }
        Map<String, String> map = new HashMap<>();
        JSONArray responseData;

        try {
                    Object last = response.get("last");
                    map.put("last", last.toString());
                    Object high = response.get("high");
                    map.put("high", high.toString().substring(0,7));
                    Object low = response.get("low");
                    map.put("low", low.toString().substring(0,7));

        } catch (JSONException e) {
            throw new ReadJSONException("Cannot get JSON from URL 2'" + base + "'.");
        }

        return map;
    }

    public Map<String, String> getForecastFromApi(Map<String, String> params) {

        // get date & time
        String date = params.get("date") + " " + params.get("time");
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date forecastDate;
        try {
            forecastDate = formatter.parse(date);
        } catch (ParseException e) {
            throw new DataParseException("Cannot parse date '" + date + "'.");
        }
        long unixDate = forecastDate.getTime() / 1000L;
        String unixDateStr = Long.toString(unixDate / 10000); // find by regex

        // build URL
        StringBuilder url = new StringBuilder();
        url
                .append("http://api.openweathermap.org/data/2.5/forecast?q=")
                .append(params.get("location"))
                .append("&units=metric")
                .append("&APPID=a42f7d9a9412365b7145d185054b1700");

        // get data from API
        JSONObject response = new JSONObject();
        try {
            response = readJsonFromUrl(url.toString());
        } catch (JSONException | IOException e) {
            throw new ReadJSONException("Cannot get JSON from URL '" + url.toString() + "'.");
        }

        // get forecast & save to map
        Map<String, String> map = new HashMap<>();

        JSONArray responseData;

        try {
            responseData = response.getJSONArray("list");
            for (int i = 0; i < responseData.length(); i++) {
                String dt = responseData.getJSONObject(i).getString("dt");
                if (dt.contains(unixDateStr)) {
                    String temperature = responseData.getJSONObject(i).getJSONObject("main").get("temp").toString();
                    map.put("temperature", temperature);
                    String mainForecast = responseData.getJSONObject(i).getJSONArray("weather").getJSONObject(0).get("main").toString();
                    map.put("main", mainForecast);
                }
            }
        } catch (JSONException e) {
            throw new ReadJSONException("Cannot get JSON from URL '" + url.toString() + "'.");
        }

        return map;
    }
}

// additional Weather API keys:
// 6d2dd29f9b0f6c23753f200fde748d77
// a42f7d9a9412365b7145d185054b1700
