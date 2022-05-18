const { Adjustment } = require('../../../src/models');

describe('Adjustment model', () => {
  describe('Adjustment validation', () => {
    let newAdjustment;

    beforeEach(() => {
      newAdjustment = {
        inventory_id: 12,
        amount: 10,
        type: 'INCREMENT',
      };
    });

    test('should correctly validate a valid adjustment', () => {
      return expect(new Adjustment(newAdjustment).validate()).resolves.toEqual(
        expect.not.stringContaining('SequelizeValidationError')
      );
    });

    test('should throw a validation error if inventory_id is not provided', () => {
      delete newAdjustment.inventory_id;
      return expect(new Adjustment(newAdjustment).validate()).rejects.toThrow();
    });

    test('should throw a validation error if amount is invalid', () => {
      newAdjustment.amount = -10;
      return expect(new Adjustment(newAdjustment).validate()).rejects.toThrow();
    });

    test('should throw a validation error if amount is not provided', () => {
      delete newAdjustment.amount;
      return expect(new Adjustment(newAdjustment).validate()).rejects.toThrow();
    });

    test('should throw a validation error if type is invalid', () => {
      newAdjustment.type = 'INCREASE';
      return expect(new Adjustment(newAdjustment).validate()).rejects.toThrow();
    });

    test('should throw a validation error if type is not provided', () => {
      delete newAdjustment.type;
      return expect(new Adjustment(newAdjustment).validate()).rejects.toThrow();
    });
  });
});
