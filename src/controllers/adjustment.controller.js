const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { adjustmentService } = require('../services');
const { adjustmentTypes } = require('../config/adjustmentTypes');

const getAdjustments = catchAsync(async (req, res) => {
  if (req.query.type && ![adjustmentTypes.INCREMENT, adjustmentTypes.DECREMENT].includes(req.query.type)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid adjustment type');
  }

  const filter = pick(req.query, ['type', 'inventory_id']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await adjustmentService.queryAdjustments(filter, options);
  res.send(result);
});

module.exports = {
  getAdjustments,
};
