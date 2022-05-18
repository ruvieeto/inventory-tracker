const { Sequelize } = require('sequelize');
const { applyExtraSetup } = require('./extra-setup');
const config = require('../config/config');

const inventoryModel = require('./inventory.model');
const adjustmentModel = require('./adjustment.model');
const locationModel = require('./location.model');
const productModel = require('./product.model');

const connectionParameters = {
  dialect: config.sequelize.dialect,
  logQueryParameters: false,
  benchmark: false,
};

if (config.env === 'production') {
  connectionParameters.protocol = config.sequelize.dialect;
  connectionParameters.dialectOptions = {
    ssl: {
      require: config.sequelize.ssl,
      rejectUnauthorized: false,
    },
  };
}

if (config.env === 'test') {
  connectionParameters.protocol = config.sequelize_test_database.dialect;
  connectionParameters.dialectOptions = {
    ssl: {
      require: config.sequelize_test_database.ssl,
      rejectUnauthorized: false,
    },
  };
}

if (config.env === 'development') {
  connectionParameters.protocol = config.sequelize.dialect;
  connectionParameters.dialectOptions = {
    ssl: {
      require: config.sequelize.ssl,
      rejectUnauthorized: false,
    },
  };
}

const databaseURL = config.env === 'test' ? config.sequelize_test_database.mysql_url : config.sequelize.mysql_url;
const sequelize = new Sequelize(databaseURL, connectionParameters);

async function testConnection() {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.info('Connection has been established successfully.');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
  }
}

if (config.env === 'production') {
  testConnection();
}
const modelDefiners = [inventoryModel, adjustmentModel, locationModel, productModel];

// We define all models according to their files.
modelDefiners.forEach((modelDefiner) => {
  modelDefiner(sequelize);
});

// We execute any extra setup after the models are defined, such as adding associations.
applyExtraSetup(sequelize);

async function syncDB() {
  try {
    await sequelize.sync({ force: JSON.parse(config.sequelize.force_sync) });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to sync to the DB:', error);
  }
}

if (config.env === 'production') {
  syncDB();
}

// Exporting the sequelize connection instance to be used around our app.
module.exports = sequelize;
module.exports.Inventory = sequelize.models.inventory;
module.exports.Adjustment = sequelize.models.adjustment;
module.exports.Product = sequelize.models.product;
module.exports.Location = sequelize.models.location;
