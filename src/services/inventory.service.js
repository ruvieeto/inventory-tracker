const httpStatus = require('http-status');
const sequelize = require('../models');
const { Inventory } = require('../models');
const ApiError = require('../utils/ApiError');
const { createAdjustment } = require('./adjustment.service');
const { adjustmentTypes } = require('../config/adjustmentTypes');

/**
 * Get inventory by inventoryId
 * @param {ObjectId} id
 * @returns {Promise<Inventory>}
 */

const getInventory = async (filter) => {
  return Inventory.findOne({
    where: filter,
  });
};

/**
 * Query for inventories
 * @param {Object} filter - filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInventories = async (filter, options) => {
  const inventories = await Inventory.findAll({
    where: filter,
    options,
  });

  return inventories;
};

/**
 * Create a inventory
 * @param {Object} inventoryBody
 * @returns {Promise<Inventory>}
 */
const createInventory = async (inventoryBody) => {
  // Confirm Inventory does not already exist for provided product-location pair
  const existingInventory = await getInventory({
    product_id: inventoryBody.product_id,
    location_id: inventoryBody.location_id,
  });
  if (existingInventory) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'An inventory record already exists for that product and location combination.'
    );
  }
  try {
    // Create the inventory and adjustment in a single transaction
    const result = await sequelize.transaction(async (inventoryTransaction) => {
      const inventory = await Inventory.create(inventoryBody, { transaction: inventoryTransaction });

      await createAdjustment(
        {
          inventory_id: inventory.id,
          amount: inventoryBody.quantity,
          type: adjustmentTypes.INCREMENT,
        },
        inventoryTransaction
      );

      return inventory;
    });

    return result;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

/**
 * Update inventory by id
 * @param {ObjectId} inventoryId
 * @param {Object} updateBody
 * @returns {Promise<Inventory>}
 */
const updateInventory = async (filter, updateBody) => {
  const inventory = await getInventory(filter);

  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }

  const { type, quantity } = updateBody;

  try {
    // Option 1: Increment or decrement inventory quantity by an amount
    if (type === adjustmentTypes.DECREMENT || type === adjustmentTypes.INCREMENT) {
      const result = await sequelize.transaction(async (incrementTransaction) => {
        await createAdjustment({
          inventory_id: inventory.id,
          amount: quantity,
          type,
          incrementTransaction,
        });

        if (type === adjustmentTypes.INCREMENT) {
          await inventory.increment('quantity', { by: quantity, transaction: incrementTransaction });
        }
        if (type === adjustmentTypes.DECREMENT) {
          if (inventory.quantity < quantity) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Inventory cannot be negative number.');
          }

          await inventory.decrement('quantity', { by: quantity, transaction: incrementTransaction });
        }

        return inventory;
      });

      await result.reload();
      return result;
    }

    // Option 2: Reset inventory quantity to new value
    if (type === adjustmentTypes.RESET) {
      const change = quantity - inventory.quantity;

      const result = await sequelize.transaction(async (resetTransaction) => {
        await createAdjustment({
          inventory_id: inventory.id,
          amount: Math.abs(change),
          type: change > 0 ? adjustmentTypes.INCREMENT : adjustmentTypes.DECREMENT,
          resetTransaction,
        });

        inventory.set(updateBody, { transaction: resetTransaction });
        await inventory.save({ transaction: resetTransaction });

        return inventory;
      });

      return result;
    }
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors ? err.errors[0].message : err.message}`);
  }
};

/**
 * Delete inventory by id
 * @param {Object} filter - filter
 * @returns {Promise<Inventory>}
 */
const deleteInventory = async (filter) => {
  const inventory = await getInventory(filter);
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }

  try {
    const result = await sequelize.transaction(async (deleteTransaction) => {
      if (inventory.quantity !== 0) {
        await createAdjustment({
          inventory_id: inventory.id,
          amount: inventory.quantity,
          type: adjustmentTypes.DECREMENT,
          deleteTransaction,
        });
      }

      await inventory.destroy({ transaction: deleteTransaction });
      return inventory;
    });

    return result;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${err.errors[0].message}`);
  }
};

module.exports = {
  createInventory,
  queryInventories,
  getInventory,
  updateInventory,
  deleteInventory,
};
