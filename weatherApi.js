const request = require('request-promise-native');
const { darkSkyApiKey } = require('./config');

const getForecast = locationTimes => Promise.all(locationTimes.map(async (point) => {
  const { currently } = await request({
    uri: `https://api.darksky.net/forecast/${darkSkyApiKey}/${point.lat},${point.lng},${point.time}`,
    json: true,
    qs: { exclude: 'minutely,hourly,daily,alerts,flags' },
  });
  return Object.assign(point, { weather: currently });
}));

module.exports = { getForecast };
