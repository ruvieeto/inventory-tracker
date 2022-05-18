const express = require('express');
const validate = require('../../middlewares/validate');
const inventoryValidation = require('../../validations/inventory.validation');
const inventoryController = require('../../controllers/inventory.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(inventoryValidation.createInventory), inventoryController.createInventory)
  .get(validate(inventoryValidation.getInventories), inventoryController.getInventories)
  .patch(validate(inventoryValidation.updateInventory), inventoryController.updateInventory)
  .delete(validate(inventoryValidation.deleteInventory), inventoryController.deleteInventory);

module.exports = router;
