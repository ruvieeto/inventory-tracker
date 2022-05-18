// create a bunch of random inventories
const inventories = [];
for (let i = 1; i < 11; i += 1) {
  const newInventory = {
    product_id: i,
    location_id: i,
    quantity: i * (12 + i),
  };
  inventories.push(newInventory);
}

module.exports = inventories;
