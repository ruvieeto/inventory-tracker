const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    PORT: Joi.number().default(3005),
    DATABASE_URL: Joi.string().required().description('MYSQL DB Connection URL'),
    SEQUELIZE_DIALECT: Joi.string().required().description('SEQUELIZE DIALECT DB'),
    SEQUELIZE_SSL: Joi.string().required().description('SEQUELIZE SSL'),
    SEQUELIZE_FORCE_SYNC: Joi.string().required().description('SEQUELIZE force sync'),
    TEST_DATABASE_URL: Joi.string().required().description('MYSQL DB Connection URL'),
    TEST_DATABASE_SEQUELIZE_DIALECT: Joi.string().required().description('SEQUELIZE DIALECT DB'),
    TEST_DATABASE_SEQUELIZE_SSL: Joi.string().required().description('SEQUELIZE SSL'),
    TEST_DATABASE_SEQUELIZE_FORCE_SYNC: Joi.string().required().description('SEQUELIZE force sync'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  sequelize: {
    mysql_url: envVars.DATABASE_URL,
    dialect: envVars.SEQUELIZE_DIALECT,
    ssl: envVars.SEQUELIZE_SSL,
    force_sync: envVars.SEQUELIZE_FORCE_SYNC,
  },
  sequelize_test_database: {
    mysql_url: envVars.TEST_DATABASE_URL,
    dialect: envVars.TEST_DATABASE_SEQUELIZE_DIALECT,
    ssl: envVars.TEST_DATABASE_SEQUELIZE_SSL,
    force_sync: envVars.TEST_DATABASE_SEQUELIZE_FORCE_SYNC,
  },
};
