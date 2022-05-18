const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { locationService } = require('../services');

const createLocation = catchAsync(async (req, res) => {
  const location = await locationService.createLocation(req.body);
  res.status(httpStatus.CREATED).send(location);
});

const getLocations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['country']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await locationService.queryLocations(filter, options);
  res.send(result);
});

const getLocation = catchAsync(async (req, res) => {
  const location = await locationService.getLocationById(req.params.locationId);
  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }
  res.send(location);
});

const updateLocation = catchAsync(async (req, res) => {
  const location = await locationService.updateLocationById(req.params.locationId, req.body);
  res.send(location);
});

const deleteLocation = catchAsync(async (req, res) => {
  await locationService.deleteLocationById(req.params.locationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation,
};
