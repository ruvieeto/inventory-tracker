const request = require('supertest');
const app = require('../../../app');
const setupTestDB = require('../../utils/setupTestDB');

try {
  setupTestDB();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Unable to set up the database:', error);
}

/* ----------------------------------------- POST /locations */

describe('POST /locations', function () {
  test('should throw error if request has missing data', async function () {
    const resp = await request(app).post(`/v1/locations`).send({
      name: 'Shopify Warehouse 20',
      address_line_2: '8th Floor',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
    });
    expect(resp.body.code).toEqual(400);
  });

  test('should respond with OK status code if request sent with correct data', async function () {
    const resp = await request(app).post(`/v1/locations`).send({
      name: 'Shopify Warehouse 20',
      address_line_1: '150 Elgin Street',
      address_line_2: '8th Floor',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'CA',
    });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toMatchObject({
      name: 'Shopify Warehouse 20',
      address_line_1: '150 Elgin Street',
      address_line_2: '8th Floor',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'CA',
    });
  });

  test('should respond with error message if request has invalid data', async function () {
    const resp = await request(app).post(`/v1/locations`).send({
      name: 'Shopify Warehouse 20',
      address_line_1: '150 Elgin Street',
      address_line_2: '8th Floor',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'JP',
    });

    expect(resp.body.code).toEqual(500);
    expect(resp.body.message).toEqual('Invalid country entered.');
  });
});

/* ----------------------------------------- GET /locations */

describe('GET /locations', function () {
  test('should respond OK status and retrieve list of locations when request body is valid', async function () {
    const resp = await request(app).get(`/v1/locations`);
    expect(resp.body.length).toEqual(11);
  });

  test('should return filtered response when request query param is provided', async function () {
    const resp = await request(app).get(`/v1/locations`).query({ country: 'CA' });
    expect(resp.body.length).toEqual(11);
  });
});

/* ----------------------------------------- GET /locations/:locationId */

describe('GET /locations/:locationId', function () {
  test('should respond with OK status and location details when location Id is valid', async function () {
    const resp = await request(app).get(`/v1/locations/9`);
    expect(resp.body).toMatchObject({
      name: 'Shopify Warehouse 9',
      address_line_1: '150 Elgin Street',
      address_line_2: 'Floor 9',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'CA',
    });
  });

  test('should respond with status 404 error message if location does not exist', async function () {
    const resp = await request(app).get(`/v1/locations/1000`);
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Location not found');
  });
});

/* ----------------------------------------- PATCH /locations/:locationId */

describe('PATCH /locations/:locationId', function () {
  test('should respond with OK status and updated location when request is valid', async function () {
    const resp = await request(app).patch(`/v1/locations/1`).send({
      name: 'Shopify Warehouse - HQ',
      address_line_1: '150 Elgin Street',
      address_line_2: 'All Floors',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'CA',
    });
    expect(resp.body).toMatchObject({
      name: 'Shopify Warehouse - HQ',
      address_line_1: '150 Elgin Street',
      address_line_2: 'All Floors',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'CA',
    });
  });

  test('should respond with status 404 error message if location does not exist', async function () {
    const resp = await request(app).patch(`/v1/locations/100`).send({
      name: 'Shopify Warehouse - HQ',
      address_line_1: '150 Elgin Street',
      address_line_2: 'All Floors',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'CA',
    });
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Location not found');
  });

  test('should respond with status 500 error message if location name is not unique', async function () {
    const resp = await request(app).patch(`/v1/locations/1`).send({
      name: 'Shopify Warehouse 8',
      address_line_1: '150 Elgin Street',
      address_line_2: 'Floor 8',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'CA',
    });
    expect(resp.body.code).toEqual(500);
    expect(resp.body.message).toEqual('Location name already in use!');
  });

  test('should respond with error message if request has invalid data', async function () {
    const resp = await request(app).patch(`/v1/locations/1`).send({
      name: 'Shopify Warehouse - HQ',
      address_line_1: '150 Elgin Street',
      address_line_2: 'All Floors',
      locality: 'Ottawa',
      region: 'ON',
      postcode: 'K2P 1L4',
      country: 'JP',
    });

    expect(resp.body.code).toEqual(500);
    expect(resp.body.message).toEqual('Invalid country entered.');
  });
});

/* ----------------------------------------- DELETE /locations/:locationId */

describe('DELETE /locations/:locationId', function () {
  test('should respond with no content status when delete request is valid', async function () {
    const resp = await request(app).delete(`/v1/locations/1`);
    expect(resp.statusCode).toEqual(204);
  });

  test('should respond with status 404 error message if location does not exist', async function () {
    const resp = await request(app).delete(`/v1/locations/100`);
    expect(resp.body.code).toEqual(404);
    expect(resp.body.message).toEqual('Location not found');
  });
});
