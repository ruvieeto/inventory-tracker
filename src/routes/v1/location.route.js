const express = require('express');
const validate = require('../../middlewares/validate');
const locationValidation = require('../../validations/location.validation');
const locationController = require('../../controllers/location.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(locationValidation.createLocation), locationController.createLocation)
  .get(validate(locationValidation.getLocations), locationController.getLocations);

router
  .route('/:locationId')
  .get(validate(locationValidation.getLocation), locationController.getLocation)
  .patch(validate(locationValidation.updateLocation), locationController.updateLocation)
  .delete(validate(locationValidation.deleteLocation), locationController.deleteLocation);

module.exports = router;
