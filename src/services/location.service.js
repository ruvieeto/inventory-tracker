const httpStatus = require('http-status');
const { Location } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a location
 * @param {Object} locationBody
 * @returns {Promise<Location>}
 */
const createLocation = async (locationBody) => {
  try {
    const location = await Location.create(locationBody);
    return location;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

/**
 * Query for locations
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLocations = async (filter, options) => {
  const locations = await Location.findAll({
    where: filter,
    options,
  });

  return locations;
};

/**
 * Get location by id
 * @param {ObjectId} id
 * @returns {Promise<Location>}
 */
const getLocationById = async (id) => {
  return Location.findOne({
    where: {
      id,
    },
  });
};

/**
 * Update location by id
 * @param {ObjectId} locationId
 * @param {Object} updateBody
 * @returns {Promise<Location>}
 */
const updateLocationById = async (locationId, updateBody) => {
  const location = await getLocationById(locationId);
  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }

  try {
    location.set(updateBody);
    await location.save();
    return location;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

/**
 * Delete location by id
 * @param {ObjectId} locationId
 * @returns {Promise<Location>}
 */
const deleteLocationById = async (locationId) => {
  const location = await getLocationById(locationId);
  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }

  try {
    await location.destroy();
    return location;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

module.exports = {
  createLocation,
  queryLocations,
  getLocationById,
  updateLocationById,
  deleteLocationById,
};
