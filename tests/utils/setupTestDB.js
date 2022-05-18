const sequelize = require('../../src/models');
const { Product, Location, Inventory, Adjustment } = require('../../src/models');
const productSeed = require('../../seeds/product.seed');
const locationSeed = require('../../seeds/location.seed');
const inventorySeed = require('../../seeds/inventory.seed');
const adjustmentSeed = require('../../seeds/adjustment.seed');

const setupTestDB = () => {
  beforeAll(async () => {
    sequelize.options.logging = false;

    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    // Product
    await Product.bulkCreate(productSeed);

    // Location
    await Location.bulkCreate(locationSeed);

    // Inventory
    await Inventory.bulkCreate(inventorySeed);

    // Adjustment
    for (let i = 0; i < inventorySeed.length; i += 1) {
      adjustmentSeed[i].amount = inventorySeed[i].quantity;
    }
    await Adjustment.bulkCreate(adjustmentSeed);
  });

  afterAll(async () => {
    sequelize.close();
  });
};

module.exports = setupTestDB;
