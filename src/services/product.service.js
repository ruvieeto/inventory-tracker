const httpStatus = require('http-status');
const { Product } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a product
 * @param {Object} productBody
 * @returns {Promise<Product>}
 */
const createProduct = async (productBody) => {
  try {
    const product = await Product.create(productBody);
    return product;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

/**
 * Query for products
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryProducts = async (filter, options) => {
  const products = await Product.findAll({
    where: filter,
    options,
  });

  return products;
};

/**
 * Get product by id
 * @param {ObjectId} id
 * @returns {Promise<Product>}
 */
const getProductById = async (id) => {
  return Product.findOne({
    where: {
      id,
    },
  });
};

/**
 * Update product by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateProductById = async (productId, updateBody) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  try {
    product.set(updateBody);
    await product.save();
    return product;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

/**
 * Delete product by id
 * @param {ObjectId} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId) => {
  const product = await getProductById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  try {
    await product.destroy();
    return product;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

module.exports = {
  createProduct,
  updateProductById,
  queryProducts,
  getProductById,
  deleteProductById,
};
