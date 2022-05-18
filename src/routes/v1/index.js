const express = require('express');
const inventoryRoute = require('./inventory.route');
const productRoute = require('./product.route');
const locationRoute = require('./location.route');
const adjustmentRoute = require('./adjustment.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/inventories',
    route: inventoryRoute,
  },
  {
    path: '/products',
    route: productRoute,
  },
  {
    path: '/locations',
    route: locationRoute,
  },
  {
    path: '/adjustments',
    route: adjustmentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
