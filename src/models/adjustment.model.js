const { DataTypes } = require('sequelize');
const { allowedAdjustmentTypes } = require('../config/adjustmentTypes');

// Function will receive an Sequelize connection object/instance as a parameter.
module.exports = (sequelize) => {
  sequelize.define(
    'adjustment',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      inventory_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
        },
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          isInt: true,
          min: 0,
        },
      },
      type: {
        allowNull: false,
        type: DataTypes.ENUM(allowedAdjustmentTypes),
        validate: {
          isIn: {
            args: [allowedAdjustmentTypes],
            msg: 'Invalid adjustment type. Must be INCREMENT or DECREMENT',
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
