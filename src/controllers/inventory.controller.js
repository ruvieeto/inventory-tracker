const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { inventoryService, locationService, productService } = require('../services');

const createInventory = catchAsync(async (req, res) => {
  // Confirm Location Exists
  const location = await locationService.getLocationById(req.body.location_id);
  if (!location) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Location not found');
  }

  // Confirm Product Exists
  const product = await productService.getProductById(req.body.product_id);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }

  // Create New Inventory
  const inventory = await inventoryService.createInventory(req.body);
  res.status(httpStatus.CREATED).send(inventory);
});

const getInventories = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['product_id', 'location_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const inventories = await inventoryService.queryInventories(filter, options);
  if (!inventories) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No inventory found');
  }
  res.send(inventories);
});

const updateInventory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['product_id', 'location_id']);
  const updatedInventory = await inventoryService.updateInventory(filter, req.body);
  res.send(updatedInventory);
});

const deleteInventory = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['product_id', 'location_id']);
  await inventoryService.deleteInventory(filter);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createInventory,
  getInventories,
  updateInventory,
  deleteInventory,
};
