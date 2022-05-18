const sequelize = require('../src/models');
const config = require('../src/config/config');
const { Product, Inventory, Adjustment, Location } = require('../src/models');

const productSeed = require('./product.seed');
const locationSeed = require('./location.seed');
const inventorySeed = require('./inventory.seed');
const adjustmentSeed = require('./adjustment.seed');

// Note for Shopify Evaluator: The database was already seeded before
// submitting my project, so you can start making requests immediately.

// If you want, you can run the npm seed script at any time to reset
// the hosted "production" DB back to what it was when you first met it.

sequelize.options.logging = false;

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.info('Connection has been established successfully.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
  }
};

const forceSyncDB = async () => {
  try {
    await sequelize.sync({ force: true });
    // eslint-disable-next-line no-console
    console.info('Databased has been force synced.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to force sync the database:', error);
  }
};

const addEntriesToDB = async () => {
  try {
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

    // eslint-disable-next-line no-console
    console.info('Seeded values have been added to the database.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to add entries to the database:', error);
  }
};

const seedDB = async () => {
  await connectToDB();

  await forceSyncDB();

  await addEntriesToDB();

  sequelize.close();
};

if (config.env === 'development') {
  seedDB();
}
