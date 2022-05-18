# Inventory Tracker - Challenge Fall 2022

Inventory Tracking Web Application for a logistics company.

This application is my submission for the [Developer Intern Challange](https://docs.google.com/document/d/1PoxpoaJymXmFB3iCMhGL6js-ibht7GO_DkCF2elCySU/)

The application allows a user to create products and warehouse locations for their business. A user is then able to create inventory for products and assign them to specific locations. To aid the user in accurately tracking their inventory across all their warehouse locations, the app creates an "adjustment record" any time inventory quantity changes. With this, a user can easily see the event history of the inventory for any product at any location.

You can find the complete [API Reference that I wrote here](https://documenter.getpostman.com/view/9341944/Uyxkkkke)

## Replit Hosting
For convenience, the server is deployed on Replit. Open the REPL and hit the "Run" button to start the server.

**Note:** When you click the "Run" button, it may take a long time to start the server as it is deployed using the free Replit plan. This means the server goes to sleep after a period of inactivity.

You will see a loading screen like this indicating the server is waking up:

<img src="https://user-images.githubusercontent.com/26422098/169159769-cbfc4ced-32e0-40e9-ac51-91c11e9f8da2.png" alt="repl-waking-up" width="400">

The hosted application can be found here:
[Replit Hosted Application](https://replit.com/@ruvieeto/inventory-tracker)


## Installation

If you prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone https://github.com/ruvieeto/inventory-tracker.git
cd inventory-tracker-main
```

Install the dependencies:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Table of Contents

- [Technologies Used](#technologies-used)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Linting](#linting)
- [Entity Relationship Diagram (ERD)](#erd)
- [High Level Project Architecture](#high-level-project-architecture)
- [Future Project updates](#future-project-updates)


## Technologies Used

- **MySQL database**: [MySQL](https://www.MySQL.com) object data modeling using [Sequelize ORM](https://sequlize.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism (see more details below)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [Npm](https://www.npmjs.com/)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Commands

Running locally:

```bash
npm run dev
```

Running in production:

```bash
npm start
```

Testing:

```bash
# run all tests
npm run test

# run all tests in watch mode
npm run test:watch
```

Linting:

```bash
# run ESLint
npm run lint

# fix ESLint errors
npm run lint:fix

# run prettier
npm run prettier

# fix prettier errors
npm run prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# DATABASE URL
# DATABASE URL secret key
DATABASE_URL=thisisasamplesecret
SEQUELIZE_DIALECT=mysql
SEQUELIZE_SSL=true
SEQUELIZE_FORCE_SYNC=false

TEST_DATABASE_URL=thisisasamplesecret
TEST_DATABASE_SEQUELIZE_DIALECT=mysql
TEST_DATABASE_SEQUELIZE_SSL=true
TEST_DATABASE_SEQUELIZE_FORCE_SYNC=false
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom express middlewares
 |--models\         # Sequlize models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```


### API Documentation

List of available routes:

**Product routes**:\
`POST /v1/products` - create a product\
`GET /v1/products` - get all products\
`GET /v1/products/:productId` - get product\
`PATCH /v1/products/:productId` - update product\
`DELETE /v1/products/:productId` - delete product

**Location routes**:\
`POST /v1/locations` - create a location\
`GET /v1/locations` - get all locations\
`GET /v1/locations/:locationId` - get location\
`PATCH /v1/locations/:locationId` - update location\
`DELETE /v1/locations/:locationId` - delete location

**Inventory routes**:\
`POST /v1/inventories` - create a inventory\
`GET /v1/inventories` - get inventories (one or multiple)\
`PATCH /v1/inventories` - update inventory\
`DELETE /v1/inventories` - delete inventory

**Adjustment routes**:\
`GET /v1/adjustments` - get all adjustments


For a more detailed breakdown of the endpoints including parameters, expected responses, and sample requests, please take a look at the API reference I wrote here:

[Complete API Reference](https://documenter.getpostman.com/view/9341944/Uyxkkkke)

## Error Handling

The app was built to have a centralized error handling mechanism.

The Controllers were built to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, the controller is wrapped inside a custom catchAsync utility wrapper, which forwards the error.

```javascript
const catchAsync = require('../utils/catchAsync');

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app was built to include a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (`catchAsync` described above will catch the error).

For example, if you are trying to get a product from the DB that is not found, and accordingly you want to send a 404 error, the code would look something like:

```javascript
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Product = require('../models/product.model');

const getProduct = async (productId) => {
  const product = await Product.findByPk(productId);

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
};
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how Joi validation schemas are written.

The validation schemas are defined in the `src/validations` directory and were used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require('express');
const validate = require('../../middlewares/validate');
const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router.post('/products', validate(productValidation.createProduct), productController.createProduct);
```

### paginate

The paginate plugin adds the `paginate` static method to the schema.

For example, adding this plugin to the `Product` model schema will allow you to do the following:

```javascript
const queryProducts = async (filter, options) => {
  const products = await Product.paginate(filter, options);
  return products;
};
```

The `filter` param is just a regular filter.

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:desc', // sort order
  limit: 5, // maximum number of results per page
  page: 2, // page number
};
```

The plugin also supports sorting by multiple criteria (separated by a comma): `sortBy: name:desc,price:asc`

The `paginate` method returns a Promise, which fulfills with an object having the following properties:

```json
{
  "results": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## ERD

Below is the Entity Relationship Diagram for this project.
![Inventory Tracker ERD](https://user-images.githubusercontent.com/26422098/168911703-1dfa07c9-c50e-423e-b15f-3a1817389233.png)

## High Level Project Architecture

Below is a diagram of the Project Architechture for this project, showing the Route-Controller-Service-Model layers.
![Inventory Tracker Architecture](https://user-images.githubusercontent.com/26422098/168911827-9a8c30d1-0b16-485e-9f38-e0ab4bc52348.png)


## Future Project updates

To improve the application, I would do the following:

**Technical Improvements:**
- **Logging:** In a production environment, the application should use a logging library such as Winston. The application as built simply logs messages to the console.
- **Rate Limiting:** To control the amount of incoming requests so a user doesn't exhaust the system's resources (unintentionally or maliciously), the server should include a rate limiter that all requests pass through.
- **Authentication Logic:** Authentication logic should be implemented to verify who is using the application. The app should permit only authenticated users or processes to gain access to their protected resources. 
- **Authorization Logic:** Authorization should be built to ensure that only the correct people have permission to take certain activities. For example, users may be able to view the inventory, but only some users should be allow to update the inventory. 

**Feature Improvements:**
- **Location Coordinates:** In a real world setting, a user may want to create a shipment (containing multiple products) that is to be sent to a customer. It would be best to fulfill the order from the closest warehouse to the customer. The app should store the latitude and longitude of the warehouse location upon the creation/update of the location (using a background job that calls an external Geocoding API). That way, an algorithm could be written, that automatically identifies the closest warehouse to fulfill the customer's order from based on the customer's shipping address. If the items are not all in stock, the order could be fulfilled from multiple locations.
- **Country and currency codes:** The countries that are allowed for are of an enumerated type but are limited to only 4 countries. In the future, the application could be extended to accept all the two-letter ISO 3166-1 alpha-2 country codes. Similarly, a complete list of the 3-letter ISO 4217 could be accepted for currency.
