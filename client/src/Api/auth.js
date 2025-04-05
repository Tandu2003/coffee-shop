import {apiAuth} from '../utils/apiCaller';

const getLogin = async (account) => {
  const res = await apiAuth.get('/auth', account);
  return res.data;
};

const login = async (account) => {
  const res = await apiAuth.post('/auth/login', account);
  return res.data;
};

const logout = async () => {
  const res = await apiAuth.post('/auth/logout');
  return res.data;
};

const signup = async (account) => {
  const res = await apiAuth.post('/auth/register', account);
  return res.data;
};

export const Auth = {
  getLogin,
  login,
  logout,
  signup,
};
