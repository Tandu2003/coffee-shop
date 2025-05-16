import { apiOrder } from '../utils/apiCaller';

const getAllOrders = async () => {
  try {
    const res = await apiOrder.get('/orders');
    return res.data;
  } catch (error) {
    console.error(
      'Get all orders error:',
      error.response?.data || error.message || error
    );
    throw error;
  }
};

const createOrder = async (data) => {
  try {
    const res = await apiOrder.post('/orders', {
      ...data,
    });
    return res.data;
  } catch (error) {
    console.error(
      'Create order error:',
      error.response?.data || error.message || error
    );
    throw error;
  }
};

const getOrderById = async (id) => {
  try {
    const res = await apiOrder.get(`/orders/${id}`);
    return res.data;
  } catch (error) {
    console.error(
      'Get order error:',
      error.response?.data || error.message || error
    );
    throw error;
  }
};

const updateOrderStatus = async (id, status) => {
  try {
    const res = await apiOrder.put(`/orders/${id}/status`, { status });
    return res.data;
  } catch (error) {
    console.error(
      'Update order status error:',
      error.response?.data || error.message || error
    );
    throw error;
  }
};

const updateOrderPaid = async (id, isPaid) => {
  try {
    const res = await apiOrder.put(`/orders/${id}/pay`, { isPaid });
    return res.data;
  } catch (error) {
    console.error(
      'Update order paid status error:',
      error.response?.data || error.message || error
    );
    throw error;
  }
};

const updateOrderDelivered = async (id, isDelivered) => {
  try {
    const res = await apiOrder.put(`/orders/${id}/deliver`, { isDelivered });
    return res.data;
  } catch (error) {
    console.error(
      'Update order delivered status error:',
      error.response?.data || error.message || error
    );
    throw error;
  }
};

export const OrderApi = {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrderStatus,
  updateOrderPaid,
  updateOrderDelivered,
};
