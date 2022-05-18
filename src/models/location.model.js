const { DataTypes } = require('sequelize');
const { countries } = require('../config/countries');

const countriesArray = Object.keys(countries);

// Function will receive an Sequelize connection object/instance as a parameter.
module.exports = (sequelize) => {
  sequelize.define(
    'location',
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
          msg: 'Location name already in use!',
        },
        validate: {
          len: {
            args: [2, 255],
            msg: 'Name must be between 2 and 255 characters!',
          },
          notNull: {
            msg: '"Name" is required',
          },
        },
      },
      address_line_1: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: 'Address Line 1 is required',
          },
        },
      },
      address_line_2: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      address_line_3: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      address_line_4: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      locality: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: {
            msg: 'Locality is required',
          },
        },
      },
      region: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      postcode: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      country: {
        allowNull: false,
        type: DataTypes.ENUM(countriesArray),
        validate: {
          isIn: {
            args: [countriesArray],
            msg: 'Invalid country entered.',
          },
          notNull: {
            msg: 'Two-letter country code is required',
          },
        },
      },
      latitude: {
        allowNull: true,
        type: DataTypes.FLOAT,
        validate: {
          isNumeric: {
            args: true,
            msg: 'Latitude must be a number',
          },
        },
      },
      longitude: {
        allowNull: true,
        type: DataTypes.FLOAT,
        validate: {
          isNumeric: {
            args: true,
            msg: 'Longitude must be a number',
          },
        },
      },
    },
    {
      timestamps: true,
      underscored: true,
      validate: {
        bothCoordsOrNone() {
          if ((this.latitude === null) !== (this.longitude === null)) {
            throw new Error(
              'Cannot contain only one of latitude or longitude. Must contain both latitude and longitude, or neither.'
            );
          }
        },
      },
    }
  );
};
