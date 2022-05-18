const request = require('supertest');
const app = require('../../../app');
const setupTestDB = require('../../utils/setupTestDB');

try {
  setupTestDB();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Unable to set up the database:', error);
}

/* ----------------------------------------- POST /products */

describe('POST /products', function () {
  test('should throw error if request has missing data', async function () {
    const resp = await request(app).post(`/v1/products`).send({
      name: 'Water Bottle',
      currency: 'USD',
    });
    expect(resp.body.code).toEqual(400);
  });

  test('should respond with OK status code if request sent with correct data', async function () {
    const resp = await request(app).post(`/v1/products`).send({
      name: 'Water Bottle',
      price: 20,
      currency: 'USD',
    });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toMatchObject({
      name: 'Water Bottle',
      price: 20,
      currency: 'USD',
    });
  });

  test('should respond with error message if request has invalid data', async function () {
    const resp = await request(app).post(`/v1/products`).send({
      name: 'Water Bottle',
      price: '20',
      currency: 'JPY',
    });

    expect(resp.body.code).toEqual(500);
    expect(resp.body.message).toEqual('Invalid currency entered.');
  });
});

/* ----------------------------------------- GET /products */

describe('GET /products', function () {
  test('should respond OK status and retrieve list of product when request body is valid', async function () {
    const resp = await request(app).get(`/v1/products`);
    expect(resp.body.length).toEqual(11);
  });
});

/* ----------------------------------------- GET /products/:productId */

describe('GET /products/:productId', function () {
  test('should respond with OK status and product details when product Id is valid', async function () {
    const resp = await request(app).get(`/v1/products/1`);
    expect(resp.body).toMatchObject({
      name: 'Sample Product 1',
      price: '10.0000',
      currency: 'CAD',
    });
  });

  test('should respond with status 404 error message if product does not exist', async function () {
    const resp = await request(app).get(`/v1/products/100`);
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Product not found');
  });
});

/* ----------------------------------------- PATCH /products/:productId */

describe('PATCH /products/:productId', function () {
  test('should respond with OK status and updated product when request is valid', async function () {
    const resp = await request(app).patch(`/v1/products/1`).send({
      name: 'Sample Product 20',
      price: 20,
      currency: 'CAD',
    });
    expect(resp.body).toMatchObject({
      name: 'Sample Product 20',
      price: 20,
      currency: 'CAD',
    });
  });

  test('should respond with status 404 error message if product does not exist', async function () {
    const resp = await request(app).patch(`/v1/products/100`).send({
      name: 'Sample Product 1.0',
      price: 20,
      currency: 'CAD',
    });
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Product not found');
  });

  test('should respond with status 500 error message if product name is not unique does not exist', async function () {
    const resp = await request(app).patch(`/v1/products/1`).send({
      name: 'Sample Product 8',
      price: 20,
      currency: 'CAD',
    });
    expect(resp.body.code).toEqual(500);
    expect(resp.body.message).toEqual('Product name already in use!');
  });

  test('should respond with error message if request has invalid data', async function () {
    const resp = await request(app).patch(`/v1/products/1`).send({
      name: 'Water Bottle',
      price: 20,
      currency: 'JPY',
    });

    expect(resp.body.code).toEqual(500);
    expect(resp.body.message).toEqual('Invalid currency entered.');
  });
});

/* ----------------------------------------- DELETE /products/:productId */

describe('DELETE /products/:productId', function () {
  test('should respond with no content status when delete request is valid', async function () {
    const resp = await request(app).delete(`/v1/products/1`);
    expect(resp.statusCode).toEqual(204);
  });

  test('should respond with status 404 error message if product does not exist', async function () {
    const resp = await request(app).delete(`/v1/products/100`);
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Product not found');
  });
});
