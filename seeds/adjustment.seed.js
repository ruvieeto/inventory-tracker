// create a bunch of fake adjustments
const adjustments = [];
for (let i = 1; i < 11; i += 1) {
  const newAdjustment = {
    inventory_id: i,
    amount: i * 10,
    type: 'INCREMENT',
  };
  adjustments.push(newAdjustment);
}

module.exports = adjustments;
