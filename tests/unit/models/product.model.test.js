const { Product } = require('../../../src/models');

describe('Product model', () => {
  describe('Product validation', () => {
    let newProduct;

    beforeEach(() => {
      newProduct = {
        name: 'Pencil',
        price: 0.49,
        currency: 'CAD',
      };
    });

    test('should correctly validate a valid product', () => {
      return expect(new Product(newProduct).validate()).resolves.toEqual(
        expect.not.stringContaining('SequelizeValidationError')
      );
    });

    test('should throw a validation error if name is not provided', () => {
      delete newProduct.name;
      return expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should throw a validation error if currency is invalid', () => {
      newProduct.currency = 'NGN';
      return expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should throw a validation error if currency is not provided', () => {
      delete newProduct.currency;
      return expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should throw a validation error if price is invalid format', () => {
      newProduct.price = '1 dollar';
      return expect(new Product(newProduct).validate()).rejects.toThrow();
    });

    test('should throw a validation error if price is not provided', () => {
      delete newProduct.price;
      return expect(new Product(newProduct).validate()).rejects.toThrow();
    });
  });
});
