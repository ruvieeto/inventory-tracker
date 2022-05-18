const { Location } = require('../../../src/models');

describe('Location model', () => {
  describe('Location validation', () => {
    let newLocation;

    beforeEach(() => {
      newLocation = {
        name: 'Warehouse HQ',
        address_line_1: '150 Elgin Street',
        address_line_2: '8th Floor',
        locality: 'Ottawa',
        region: 'ON',
        postcode: 'K2P 1L4',
        country: 'CA',
      };
    });

    test('should correctly validate a valid location', () => {
      return expect(new Location(newLocation).validate()).resolves.toEqual(
        expect.not.stringContaining('SequelizeValidationError')
      );
    });

    test('should throw a validation error if location name is not provided', () => {
      delete newLocation.name;
      return expect(new Location(newLocation).validate()).rejects.toThrow();
    });

    test('should throw a validation error if address_line_1 is not provided', () => {
      delete newLocation.address_line_1;
      return expect(new Location(newLocation).validate()).rejects.toThrow();
    });

    test('should throw a validation error if locality is not provided', () => {
      delete newLocation.locality;
      return expect(new Location(newLocation).validate()).rejects.toThrow();
    });

    test('should throw a validation error if country is not provided', () => {
      delete newLocation.country;
      return expect(new Location(newLocation).validate()).rejects.toThrow();
    });

    test('should throw a validation error if country is invalid', () => {
      newLocation.country = 'Canada';
      return expect(new Location(newLocation).validate()).rejects.toThrow();
    });
  });
});
