const express = require('express');

const { getWeatherPoints } = require('./directionsApi');
const { getForecast } = require('./weatherApi');

const createMissingParamsError = param => ({
  statusCode: 404,
  message: `Missing required request query param ${param}`,
});

const app = express();

app.get('/route-weather', async (req, res, next) => {
  const { start, end } = req.query;
  let { mode, increment, time } = req.query;
  if (!start) {
    return next(createMissingParamsError('start'));
  }
  if (!end) {
    return next(createMissingParamsError('end'));
  }
  if (!mode) {
    mode = 'bicycle';
  }
  if (!increment) {
    increment = 30; // forecast increment defaults to 30 minutes
  }
  // Dark Sky API uses unix timestamps in seconds
  if (!time) {
    time = Math.floor(Date.now() / 1000);
  } else {
    time = Math.floor(new Date(time).getTime() / 1000);
  }

  let weatherPoints;
  try {
    weatherPoints = await getWeatherPoints({
      start,
      end,
      mode,
      increment,
      time,
    });
  } catch (e) {
    return next({
      message: 'Error from Mapquest API',
      statusCode: 500,
      originalError: e,
    });
  }

  let forecast;
  try {
    forecast = await getForecast(weatherPoints, time);
  } catch (e) {
    return next({
      message: 'Error from Dark Sky API',
      statusCode: 500,
      originalError: e,
    });
  }

  return res.json({ forecast });
});

// eslint-disable-next-line
app.use((err, _req, res, _next) => {
  const { message, statusCode, originalError } = err;
  res.status(statusCode).json({ message, originalError });
});

app.listen(3000);
