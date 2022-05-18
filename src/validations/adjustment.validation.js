const Joi = require('joi');

const createAdjustment = {
  body: Joi.object().keys({
    inventory_id: Joi.number().required(),
    amount: Joi.number().positive().required(),
    type: Joi.string().required(),
  }),
};

const getAdjustments = {
  query: Joi.object().keys({
    inventory_id: Joi.number(),
    type: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createAdjustment,
  getAdjustments,
};
