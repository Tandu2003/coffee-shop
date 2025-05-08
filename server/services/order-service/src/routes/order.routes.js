const express = require('express');
const OrderController = require('../controllers/order.controller');

const Router = express.Router();

// Router for api/orders
Router.route('/').get(OrderController.getOrders);
Router.route('/:id').get(OrderController.getOrder);
Router.route('/user/:userId').get(OrderController.getUserOrders);
Router.route('/').post(OrderController.createOrder);
Router.route('/:id/status').put(OrderController.updateOrderStatus);
Router.route('/:id/pay').put(OrderController.updateOrderPaid);
Router.route('/:id/deliver').put(OrderController.updateOrderDelivered);
Router.route('/:id').delete(OrderController.cancelOrder);

module.exports = Router;
