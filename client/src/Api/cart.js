import { apiCart } from '../utils/apiCaller';

const getCart = async () => {
  const res = await apiCart.get('/cart');
  return res.data;
};

const addToCart = async (item) => {
  const res = await apiCart.post('/cart', {
    productId: item.id,
    productType: item.type,
    name: item.title,
    image: item.img,
    price: item.price,
    quantity: item.quantity,
    options: item.options,
  });
  return res.data;
};

const updateCartItem = async (itemId, quantity) => {
  const res = await apiCart.put(`/cart/${itemId}`, { quantity });
  return res.data;
};

const removeCartItem = async (itemId) => {
  const res = await apiCart.delete(`/cart/${itemId}`);
  return res.data;
};

const clearCart = async () => {
  const res = await apiCart.delete('/cart');
  return res.data;
};

export const CartApi = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
