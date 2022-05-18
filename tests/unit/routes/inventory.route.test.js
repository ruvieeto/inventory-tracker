const request = require('supertest');
const app = require('../../../app');
const setupTestDB = require('../../utils/setupTestDB');

try {
  setupTestDB();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Unable to set up the database:', error);
}

/* ----------------------------------------- POST /inventories */

describe('POST /inventories', function () {
  test('should throw error if request has missing data', async function () {
    const resp = await request(app).post(`/v1/inventories`).send({
      location_id: 2,
      quantity: 10,
    });
    expect(resp.body.code).toEqual(400);
  });

  test('should respond with OK status code if request sent with correct data', async function () {
    const resp = await request(app).post(`/v1/inventories`).send({
      product_id: 4,
      location_id: 3,
      quantity: 10,
    });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toMatchObject({
      product_id: 4,
      location_id: 3,
      quantity: 10,
    });
  });

  test('should respond with error message if product does not exist', async function () {
    const resp = await request(app).post(`/v1/inventories`).send({
      product_id: 100,
      location_id: 2,
      quantity: 10,
    });

    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Product not found');
  });

  test('should respond with error message if location does not exist', async function () {
    const resp = await request(app).post(`/v1/inventories`).send({
      product_id: 4,
      location_id: 200,
      quantity: 10,
    });

    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Location not found');
  });
});

/* ----------------------------------------- GET /inventories */

describe('GET /inventories', function () {
  test('should respond OK status and retrieve list of inventories when request query params are valid', async function () {
    const resp = await request(app).get(`/v1/inventories`).query({ location_id: 3 });
    expect(resp.body.length).toEqual(2);
  });

  test('should only return one inventory when both query params are provided', async function () {
    const resp = await request(app).get(`/v1/inventories`).query({ location_id: 9, product_id: 9 });
    expect(resp.body.length).toEqual(1);
    expect(resp.body).toMatchObject([
      {
        product_id: 9,
        location_id: 9,
        quantity: 189,
      },
    ]);
  });

  test('should respond with empty object if inventory does not exist that matches query params', async function () {
    const resp = await request(app).get(`/v1/inventories`).query({ location_id: 4, product_id: 10 });
    expect(resp.body.length).toEqual(0);
  });
});

/* ----------------------------------------- PATCH /inventories */

describe('PATCH /inventories', function () {
  test('should respond with OK status and updated inventory when request is valid', async function () {
    const resp = await request(app).patch(`/v1/inventories`).query({ location_id: 5, product_id: 5 }).send({
      quantity: 100,
      type: 'RESET',
    });
    expect(resp.body).toMatchObject({
      product_id: 5,
      location_id: 5,
      quantity: 100,
    });
  });

  test('should respond with status 404 error message if update type is invalid', async function () {
    const resp = await request(app).patch(`/v1/inventories`).query({ location_id: 4, product_id: 8 }).send({
      quantity: 100,
      type: 'INCREASE',
    });
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Inventory not found');
  });

  test('should respond with status 404 error message if inventory does not exist', async function () {
    const resp = await request(app).patch(`/v1/inventories`).query({ location_id: 4, product_id: 8 }).send({
      quantity: 100,
      type: 'INCREMENT',
    });
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Inventory not found');
  });

  test('should respond with status 404 error message if non-existent location provided as param', async function () {
    const resp = await request(app).patch(`/v1/inventories`).query({ location_id: 1000, product_id: 8 }).send({
      quantity: 100,
      type: 'INCREMENT',
    });
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Inventory not found');
  });

  test('should respond with status 404 error message if non-existent product provided as param', async function () {
    const resp = await request(app).patch(`/v1/inventories`).query({ location_id: 4, product_id: 800 }).send({
      quantity: 100,
      type: 'INCREMENT',
    });
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Inventory not found');
  });
});

/* ----------------------------------------- DELETE /inventories */

describe('DELETE /inventories', function () {
  test('should respond with no content status when delete request is valid', async function () {
    const resp = await request(app).delete(`/v1/inventories`).query({ location_id: 6, product_id: 6 });
    expect(resp.statusCode).toEqual(204);
  });

  test('should respond with status 404 error message if inventory does not exist', async function () {
    const resp = await request(app).delete(`/v1/inventories`).query({ location_id: 10, product_id: 6 });
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Inventory not found');
  });
});
