const request = require('supertest');
const app = require('../../../app');
const setupTestDB = require('../../utils/setupTestDB');

try {
  setupTestDB();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error('Unable to set up the database:', error);
}

/* ----------------------------------------- GET /adjustments */

describe('GET /adjustments', function () {
  test('should respond OK status and retrieve list of adjustments when request query params are valid', async function () {
    const resp = await request(app).get(`/v1/adjustments`).query({ type: 'INCREMENT' });
    expect(resp.body.length).toEqual(10);
  });

  test('should respond OK status and retrieve list of adjustments when no query params are provided', async function () {
    const resp = await request(app).get(`/v1/adjustments`);
    expect(resp.body.length).toEqual(10);
  });

  test('should respond with empty if adjustment does not exist that matches query params', async function () {
    const resp = await request(app).get(`/v1/adjustments`).query({ type: 'DECREMENT' });
    expect(resp.body.length).toEqual(0);
  });

  test('should respond with error if adjustment type is invalid', async function () {
    const resp = await request(app).get(`/v1/adjustments`).query({ type: 'DECREASE' });
    expect(resp.body.code).toEqual(400);
    expect(resp.body.message).toEqual('Invalid adjustment type');
  });
});
