const adjustmentTypes = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  RESET: 'RESET',
};

const allowedAdjustmentTypes = [adjustmentTypes.INCREMENT, adjustmentTypes.DECREMENT];

module.exports = {
  adjustmentTypes,
  allowedAdjustmentTypes,
};
