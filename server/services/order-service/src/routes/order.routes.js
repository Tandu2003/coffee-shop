const express = require('express');
const OrderController = require('../controllers/order.controller');
const authenticate = require('../middlewares/authenticate');
const checkAdmin = require('../middlewares/checkAdmin');

const Router = express.Router();

// Router for api/orders
Router.get('/', authenticate, checkAdmin, OrderController.getOrders);
Router.get('/:id', authenticate, OrderController.getOrder);
Router.get('/user/:userId', authenticate, OrderController.getUserOrders);
Router.post('/', authenticate, OrderController.createOrder);
Router.put(
  '/:id/status',
  authenticate,
  checkAdmin,
  OrderController.updateOrderStatus,
);
Router.put('/:id/pay', authenticate, OrderController.updateOrderPaid);
Router.put(
  '/:id/deliver',
  authenticate,
  checkAdmin,
  OrderController.updateOrderDelivered,
);
Router.delete('/:id', authenticate, OrderController.cancelOrder);

module.exports = Router;
