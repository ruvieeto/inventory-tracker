const express = require('express');
const validate = require('../../middlewares/validate');
const adjustmentValidation = require('../../validations/adjustment.validation');
const adjustmentController = require('../../controllers/adjustment.controller');

const router = express.Router();

router.route('/').get(validate(adjustmentValidation.getAdjustments), adjustmentController.getAdjustments);

module.exports = router;
