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
      res.status(500).json({ message: error.message });
    }
  }

  // [GET] /api/orders/:id
  async getOrder(req, res) {
    const { id } = req.params;
    try {
      const order = await Order.findById(id).populate('orderItems');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [GET] /api/orders/user/:userId
  async getUserOrders(req, res) {
    const { userId } = req.params;
    try {
      const orders = await Order.find({ userId }).populate('orderItems');
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        userId,
        notes,
      } = req.body;

      // Create order items first
      const orderItemsIds = [];
      for (const item of orderItems) {
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
        userId,
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
      res.status(500).json({ message: error.message });
    }
  }

  // [PUT] /api/orders/:id/status
  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      ).populate('orderItems');

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [PUT] /api/orders/:id/pay
  async updateOrderPaid(req, res) {
    try {
      const { id } = req.params;
      const { paymentResult } = req.body;

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult,
        },
        { new: true },
      ).populate('orderItems');

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [PUT] /api/orders/:id/deliver
  async updateOrderDelivered(req, res) {
    try {
      const { id } = req.params;
      const { trackingNumber } = req.body;

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

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // [DELETE] /api/orders/:id
  async cancelOrder(req, res) {
    try {
      const { id } = req.params;

      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
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
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new OrderController();
