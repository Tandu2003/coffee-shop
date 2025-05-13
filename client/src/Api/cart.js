import {apiAuth} from '../utils/apiCaller';

const getCart = async () => {
  const res = await apiAuth.get('v1/cart');
  return res.data;
}

const addToCart = async (item) => {
  const res = await apiAuth.post('v1/cart', item);
  return res.data;
};

const updateCartItem = async (itemId, quantity) => {
  const res = await apiAuth.put(`v1/cart/${itemId}`, { quantity });
  return res.data;
}

const removeCartItem = async (itemId) => {
  const res = await apiAuth.delete(`v1/cart/${itemId}`);
  return res.data;
};

const clearCart = async () => {
  const res = await apiAuth.delete('v1/cart');
  return res.data;
};

export const CartApi = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};