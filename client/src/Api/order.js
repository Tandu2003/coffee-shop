import axios from 'axios';
import {apiAuth} from '../utils/apiCaller';

// Create a specific axios instance for orders
// Since the API gateway handles order routes, we're pointing to the auth service
const apiOrder = axios.create({
  baseURL: `${process.env.REACT_APP_API_AUTH}/api/orders`,
  withCredentials: true
});

const getAllOrders = async () => {
  try {
    console.log('Fetching all orders...');
    // We'll use the apiAuth instance since it already has proper authentication setup
    const res = await apiAuth.get('/orders');
    console.log('Orders fetched successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error("Get all orders error:", error.response?.data || error.message || error);
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    console.log(`Fetching order with ID: ${id}`);
    const res = await apiAuth.get(`/orders/${id}`);
    console.log('Order details fetched successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error("Get order error:", error.response?.data || error.message || error);
    throw error;
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    console.log(`Updating order ${id} status to: ${status}`);
    const res = await apiAuth.put(`/orders/${id}/status`, { status });
    console.log('Order status updated successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error("Update order status error:", error.response?.data || error.message || error);
    throw error;
  }
};

const updateOrderPaid = async (id, isPaid) => {
  try {
    console.log(`Updating order ${id} payment status to: ${isPaid ? 'Paid' : 'Not Paid'}`);
    const res = await apiAuth.put(`/orders/${id}/pay`, { isPaid });
    console.log('Order payment status updated successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error("Update order paid status error:", error.response?.data || error.message || error);
    throw error;
  }
};

const updateOrderDelivered = async (id, isDelivered) => {
  try {
    console.log(`Updating order ${id} delivery status to: ${isDelivered ? 'Delivered' : 'Not Delivered'}`);
    const res = await apiAuth.put(`/orders/${id}/deliver`, { isDelivered });
    console.log('Order delivery status updated successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error("Update order delivered status error:", error.response?.data || error.message || error);
    throw error;
  }
};

export const OrderApi = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrderPaid,
  updateOrderDelivered
};
