# Geo-weather API

This API combines the Mapquest directions API and the Dark Sky weather API to provide weather over time along a route. You supply the start point and end point, and optionally the mode of transportation, start time, and forecast increment. The API will return a forecast with location and time data for the duration of your trip.

## Running the project locally

Clone the repo to your machine and run `npm install`. You will need to have a `config.js` file in the root of the project with the following format:
```js
module.exports = {
  mapquestApiKey: 'your-mapquest-api-key',
  darkSkyApiKey: 'your-dark-sky-api-key',
};
```
Then just run `npm start` to start the API server, which listens on port 3000.

## Request format

This api accepts `GET` requests to `/route-weather` with the following query string params:
- `start [required]`: starting location in Mapquest-parsable format
- `end [required]`: ending location in Mapquest-parsable format
- `mode`: `car`, `bicycle`, or `walking`. Defaults to `bicycle`
- `increment`: time increment of weather forecast periods, in minutes. Defaults to `30`
- `time`: starting timestamp in ISO 8601 format. Defaults to current time

## Response
- The API will return a JSON response with a single top-level property, `forecast`. See the example below:

`GET /route-weather?start=Brooklyn, NY&end=Brewster, NY&mode=bicycle&increment=60`
```json
{
  "forecast": [
    {
      "lng": -73.949371,
      "lat": 40.648922,
      "time": 1557196612,
      "city": "NYC",
      "state": "New York",
      "postcode": "11226",
      "country": "United States of America",
      "weather": {
        "time": 1557196612,
        "summary": "Mostly Cloudy",
        "icon": "partly-cloudy-night",
        "precipIntensity": 0,
        "precipProbability": 0,
        "temperature": 55.36,
        "apparentTemperature": 55.36,
        "dewPoint": 47.25,
        "humidity": 0.74,
        "pressure": 1020.18,
        "windSpeed": 5.52,
        "windGust": 6.14,
        "windBearing": 160,
        "cloudCover": 0.91,
        "uvIndex": 0,
        "visibility": 9.2,
        "ozone": 341.49
      }
    },
    {
      "lng": -73.97274328005592,
      "lat": 40.791933868592736,
      "time": 1557200212,
      "city": "NYC",
      "state": "New York",
      "postcode": "10025",
      "country": "United States of America",
      "weather": {
        "time": 1557200212,
        "summary": "Mostly Cloudy",
        "icon": "partly-cloudy-night",
        "precipIntensity": 0,
        "precipProbability": 0,
        "temperature": 55.73,
        "apparentTemperature": 55.73,
        "dewPoint": 48.19,
        "humidity": 0.76,
        "pressure": 1020.32,
        "windSpeed": 3.68,
        "windGust": 4.96,
        "windBearing": 163,
        "cloudCover": 0.71,
        "uvIndex": 0,
        "visibility": 9.78,
        "ozone": 342.23
      }
    },
    {
      "lng": -73.87215712846864,
      "lat": 40.94276710996917,
      "time": 1557203812,
      "city": "Yonkers",
      "state": "New York",
      "postcode": "10701",
      "country": "United States of America",
      "weather": {
        "time": 1557203812,
        "summary": "Partly Cloudy",
        "icon": "partly-cloudy-night",
        "precipIntensity": 0.0016,
        "precipProbability": 0.02,
        "precipType": "rain",
        "temperature": 53.73,
        "apparentTemperature": 53.73,
        "dewPoint": 49.26,
        "humidity": 0.85,
        "pressure": 1020.3,
        "windSpeed": 4.28,
        "windGust": 7.76,
        "windBearing": 172,
        "cloudCover": 0.58,
        "uvIndex": 0,
        "visibility": 10,
        "ozone": 344.93
      }
    },
    {
      "lng": -73.82096421291052,
      "lat": 41.12169586126841,
      "time": 1557207412,
      "state": "New York",
      "postcode": "10532",
      "country": "United States of America",
      "weather": {
        "time": 1557207412,
        "summary": "Partly Cloudy",
        "icon": "partly-cloudy-night",
        "precipIntensity": 0.0008,
        "precipProbability": 0.01,
        "precipType": "rain",
        "temperature": 52.05,
        "apparentTemperature": 52.05,
        "dewPoint": 48.9,
        "humidity": 0.89,
        "pressure": 1020.24,
        "windSpeed": 4.46,
        "windGust": 9.11,
        "windBearing": 178,
        "cloudCover": 0.45,
        "uvIndex": 0,
        "visibility": 10,
        "ozone": 347.57
      }
    },
    {
      "lng": -73.76151578011472,
      "lat": 41.31119424665392,
      "time": 1557211012,
      "state": "New York",
      "postcode": "10598",
      "country": "United States of America",
      "weather": {
        "time": 1557211012,
        "summary": "Partly Cloudy",
        "icon": "partly-cloudy-night",
        "precipIntensity": 0.0013,
        "precipProbability": 0.01,
        "precipType": "rain",
        "temperature": 51.15,
        "apparentTemperature": 51.15,
        "dewPoint": 47.83,
        "humidity": 0.88,
        "pressure": 1020.12,
        "windSpeed": 4.65,
        "windGust": 10.09,
        "windBearing": 183,
        "cloudCover": 0.35,
        "uvIndex": 0,
        "visibility": 10,
        "ozone": 349.42
      }
    }
  ]
}
```
