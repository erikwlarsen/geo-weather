const request = require('request-promise-native');
const { mapquestApiKey } = require('./config');

const modeMap = {
  bicycle: 'bicycle',
  walking: 'pedestrian',
  car: 'fastest',
};

const queryDirectionsApi = async ({
  start,
  end,
  mode,
}) => {
  const resp = await request({
    uri: 'http://open.mapquestapi.com/directions/v2/route',
    qs: {
      key: mapquestApiKey,
      from: start,
      to: end,
      routeType: modeMap[mode],
    },
    json: true,
  });
  let runningTime = 0;
  return resp.route.legs[0].maneuvers.map((step) => {
    runningTime += step.time;
    return {
      lng: step.startPoint.lng,
      lat: step.startPoint.lat,
      startTime: runningTime - step.time,
      endTime: runningTime,
      timeOnStep: step.time,
    };
  });
};

const calculateIncrementalLocations = (directions, increment) => {
  let runningTotal = 0;
  return directions.reduce((locations, step, idx) => {
    const {
      lng, lat, startTime, endTime, timeOnStep,
    } = step;
    const nextStep = directions[idx + 1];
    while (startTime <= runningTotal && runningTotal <= endTime) {
      // Determine how far into the step we are
      const completeRatio = (runningTotal - startTime) / timeOnStep || 1;
      const lngDiff = nextStep.lng - lng;
      const latDiff = nextStep.lat - lat;
      locations.push({
        lng: lng + (lngDiff * completeRatio),
        lat: lat + (latDiff * completeRatio),
        time: runningTotal,
      });
      runningTotal += increment;
    }
    return locations;
  }, []);
};

const addGeodata = locations => Promise.all(locations.map(async (location) => {
  const geodata = await queryLocation(location.lat, location.lng);
  const {
    address: {
      city, state, postcode, country,
    } = {},
  } = geodata;
  return {
    ...location, city, state, postcode, country,
  };
}));

const queryLocation = (lat, lng) => request({
  uri: 'http://open.mapquestapi.com/nominatim/v1/reverse.php',
  qs: {
    key: mapquestApiKey,
    lat,
    lon: lng,
    format: 'json',
  },
  json: true,
});

const mapTimesToTimestamps = (locations, startTime) => locations.map((location) => {
  const timestamp = startTime + (location.time);
  return { ...location, time: timestamp };
});
const getWeatherPoints = async ({
  start, end, mode, increment, time,
}) => {
  const directions = await queryDirectionsApi({ start, end, mode });
  const incrementInSeconds = increment * 60; // mapquest API uses seconds
  const incrementalLocations = calculateIncrementalLocations(directions, incrementInSeconds);
  const locationsWithGeodata = await addGeodata(incrementalLocations);
  return mapTimesToTimestamps(locationsWithGeodata, time);
};

module.exports = { getWeatherPoints };
