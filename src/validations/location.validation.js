const Joi = require('joi');

const createLocation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address_line_1: Joi.string().required(),
    address_line_2: Joi.string(),
    address_line_3: Joi.string(),
    address_line_4: Joi.string(),
    locality: Joi.string(),
    region: Joi.string(),
    postcode: Joi.string(),
    country: Joi.string().required(),
  }),
};

const getLocations = {
  query: Joi.object().keys({
    country: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getLocation = {
  params: Joi.object().keys({
    locationId: Joi.string().required(),
  }),
};

const updateLocation = {
  params: Joi.object().keys({
    locationId: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      address_line_1: Joi.string(),
      address_line_2: Joi.string(),
      address_line_3: Joi.string(),
      address_line_4: Joi.string(),
      locality: Joi.string(),
      region: Joi.string(),
      postcode: Joi.string(),
      country: Joi.string(),
      coordinates: Joi.string(),
    })
    .min(1),
};

const deleteLocation = {
  params: Joi.object().keys({
    locationId: Joi.string(),
  }),
};

module.exports = {
  createLocation,
  getLocations,
  getLocation,
  updateLocation,
  deleteLocation,
};
