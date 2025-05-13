import axios from 'axios';

axios.defaults.withCredentials = true;

const urlAuth = process.env.REACT_APP_API_AUTH;
const urlProduct = process.env.REACT_APP_API_PRODUCT;
const urlMerch = process.env.REACT_APP_API_MERCH;
const urlOrder = process.env.REACT_APP_API_ORDER;
const urlCart = process.env.REACT_APP_API_CART;

export const apiAuth = axios.create({
  baseURL: `${urlAuth}/api`,
});

export const apiProduct = axios.create({
  baseURL: `${urlProduct}/api`,
});

export const apiMerch = axios.create({
  baseURL: `${urlMerch}/api`,
});

export const apiOrder = axios.create({
  baseURL: `${urlOrder}/api`,
});

export const apiCart = axios.create({
  baseURL: `${urlCart}/api`,
});
