const Order = require('../models/order.model');
const OrderItem = require('../models/orderItem.model');
const mongoose = require('mongoose');

class OrderController {
  // [GET] /api/orders
  async getOrders(req, res) {
    try {
      const orders = await Order.find().populate('orderItems');
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error in getOrders:', error);
      res.status(500).json({
        message: 'Internal server error',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // [GET] /api/orders/:id
  async getOrder(req, res) {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid order ID format' });
      }

      const order = await Order.findById(id).populate('orderItems');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user is authorized to view this order
      if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: 'Not authorized to view this order' });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error('Error in getOrder:', error);
      res.status(500).json({
        message: 'Internal server error',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // [GET] /api/orders/user/:userId
  async getUserOrders(req, res) {
    const { userId } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      // Check if user is requesting their own orders or is admin
      if (userId !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: 'Not authorized to view these orders' });
      }

      const orders = await Order.find({ userId }).populate('orderItems');
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      res.status(500).json({
        message: 'Internal server error',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // [POST] /api/orders
  async createOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        notes,
      } = req.body;

      // Validate required fields
      if (
        !orderItems ||
        !Array.isArray(orderItems) ||
        orderItems.length === 0
      ) {
        return res.status(400).json({ message: 'Order items are required' });
      }

      if (
        !shippingAddress ||
        !paymentMethod ||
        !itemsPrice ||
        !shippingPrice ||
        !taxPrice ||
        !totalPrice
      ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // Validate prices
      if (
        itemsPrice < 0 ||
        shippingPrice < 0 ||
        taxPrice < 0 ||
        totalPrice < 0
      ) {
        return res.status(400).json({ message: 'Prices cannot be negative' });
      }

      // Create order items first
      const orderItemsIds = [];
      for (const item of orderItems) {
        if (!item.name || !item.quantity || !item.price || !item.productId) {
          await session.abortTransaction();
          return res.status(400).json({ message: 'Invalid order item data' });
        }

        const newOrderItem = new OrderItem({
          name: item.name,
          quantity: item.quantity,
          image: item.image,
          price: item.price,
          productId: item.productId,
          productType: item.productType,
          options: item.options,
        });

        const savedOrderItem = await newOrderItem.save({ session });
        orderItemsIds.push(savedOrderItem._id);
      }

      // Create order with reference to order items
      const order = new Order({
        orderItems: orderItemsIds,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        userId: req.user.id,
        notes,
      });

      const createdOrder = await order.save({ session });

      await session.commitTransaction();
      session.endSession();

      // Populate order items to return complete order details
      const populatedOrder = await Order.findById(createdOrder._id).populate(
        'orderItems',
      );

      res.status(201).json(populatedOrder);
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error('Error in createOrder:', error);
      res.status(500).json({
        message: 'Failed to create order',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // [PUT] /api/orders/:id/status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid order ID format' });
      }

      if (
        ![
          'Pending',
          'Processing',
          'Shipped',
          'Delivered',
          'Cancelled',
        ].includes(status)
      ) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      ).populate('orderItems');

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      res.status(500).json({
        message: 'Failed to update order status',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // [PUT] /api/orders/:id/pay
  async updateOrderPaid(req, res) {
    try {
      const { id } = req.params;
      const { paymentResult } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid order ID format' });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user is authorized to update this order
      if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: 'Not authorized to update this order' });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult,
        },
        { new: true },
      ).populate('orderItems');

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error in updateOrderPaid:', error);
      res.status(500).json({
        message: 'Failed to update payment status',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // [PUT] /api/orders/:id/deliver
  async updateOrderDelivered(req, res) {
    try {
      const { id } = req.params;
      const { trackingNumber } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid order ID format' });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (!order.isPaid) {
        return res
          .status(400)
          .json({ message: 'Order must be paid before delivery' });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          isDelivered: true,
          deliveredAt: Date.now(),
          status: 'Delivered',
          trackingNumber,
        },
        { new: true },
      ).populate('orderItems');

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error in updateOrderDelivered:', error);
      res.status(500).json({
        message: 'Failed to update delivery status',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }

  // [DELETE] /api/orders/:id
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid order ID format' });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user is authorized to cancel this order
      if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: 'Not authorized to cancel this order' });
      }

      // Only allow cancellation if order is still pending
      if (order.status !== 'Pending') {
        return res.status(400).json({
          message: 'Cannot cancel order that has been processed',
        });
      }

      order.status = 'Cancelled';
      await order.save();

      res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error) {
      console.error('Error in cancelOrder:', error);
      res.status(500).json({
        message: 'Failed to cancel order',
        error:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
}

module.exports = new OrderController();
