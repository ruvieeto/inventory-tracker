const { Inventory } = require('../../../src/models');

describe('Inventory model', () => {
  describe('Inventory validation', () => {
    let newInventory;

    beforeEach(() => {
      newInventory = {
        location_id: 4,
        product_id: 5,
        quantity: 20,
      };
    });

    test('should correctly validate a valid inventory', () => {
      return expect(new Inventory(newInventory).validate()).resolves.toEqual(
        expect.not.stringContaining('SequelizeValidationError')
      );
    });

    test('should throw a validation error if location_id is invalid format', () => {
      newInventory.location_id = 'ten';
      return expect(new Inventory(newInventory).validate()).rejects.toThrow();
    });

    test('should throw a validation error if location_id is not provided', () => {
      delete newInventory.location_id;
      return expect(new Inventory(newInventory).validate()).rejects.toThrow();
    });

    test('should throw a validation error if quantity is invalid', () => {
      newInventory.quantity = -20;
      return expect(new Inventory(newInventory).validate()).rejects.toThrow();
    });

    test('should throw a validation error if product_id is invalid format', () => {
      newInventory.product_id = 'three';
      return expect(new Inventory(newInventory).validate()).rejects.toThrow();
    });

    test('should throw a validation error if product_id is not provided', () => {
      delete newInventory.product_id;
      return expect(new Inventory(newInventory).validate()).rejects.toThrow();
    });
  });
});
