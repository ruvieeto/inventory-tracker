const { DataTypes } = require('sequelize');
const { currencies } = require('../config/currencies');

const currenciesArray = Object.keys(currencies);

// Function will receive an Sequelize connection object/instance as a parameter.
module.exports = (sequelize) => {
  sequelize.define(
    'product',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: {
          args: true,
          msg: 'Product name already in use!',
        },
        validate: {
          len: {
            args: [2, 255],
            msg: 'Name must be between 2 and 255 characters!',
          },
        },
      },
      price: {
        allowNull: false,
        type: DataTypes.DECIMAL(20, 4),
        validate: {
          isDecimal: true,
          min: 0,
        },
      },
      currency: {
        allowNull: false,
        type: DataTypes.ENUM(currenciesArray),
        validate: {
          isIn: {
            args: [currenciesArray],
            msg: 'Invalid currency entered.',
          },
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
    }
  );
};
