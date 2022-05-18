const httpStatus = require('http-status');
const { Adjustment } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Create a adjustment
 * Adjustment must be created as part of a DB transaction to keep inventory and transactions in sync
 * @param {Object} adjustmentBody
 * @param {Object} inventoryTransaction
 * @returns {Promise<Adjustment>}
 */
const createAdjustment = async (adjustmentBody, inventoryTransaction) => {
  try {
    const adjustment = await Adjustment.create(adjustmentBody, { transaction: inventoryTransaction });
    return adjustment;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

/**
 * Query for adjustments
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAdjustments = async (filter, options) => {
  const adjustments = await Adjustment.findAll({
    where: filter,
    options,
  });

  return adjustments;
};

module.exports = {
  createAdjustment,
  queryAdjustments,
};
