const Joi = require('joi');

const createInventory = {
  body: Joi.object().keys({
    location_id: Joi.number().required(),
    product_id: Joi.number().required(),
    quantity: Joi.number().min(0).required(),
  }),
};

const getInventories = {
  query: Joi.object().keys({
    location_id: Joi.number(),
    product_id: Joi.number(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInventory = {
  query: Joi.object().keys({
    location_id: Joi.number().required(),
    product_id: Joi.number().required(),
  }),
};

const updateInventory = {
  query: Joi.object().keys({
    location_id: Joi.number().required(),
    product_id: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      quantity: Joi.number().min(0),
      type: Joi.string().required(),
    })
    .min(1),
};

const deleteInventory = {
  query: Joi.object().keys({
    location_id: Joi.number().required(),
    product_id: Joi.number().required(),
  }),
};

module.exports = {
  createInventory,
  getInventories,
  getInventory,
  updateInventory,
  deleteInventory,
};
