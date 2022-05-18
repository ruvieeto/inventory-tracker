const Joi = require('joi');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    currency: Joi.string().required(),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.number().required(),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.number().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      price: Joi.number().required(),
      currency: Joi.string().required(),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required(),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
