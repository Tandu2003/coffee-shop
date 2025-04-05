import {apiAuth} from '../utils/apiCaller';

const getAllAccounts = async () => {
  const res = await apiAuth.get('v1/accounts');
  return res.data;
};

const updateAccount = async (account) => {
  const res = await apiAuth.put(`v1/accounts/${account.email}`, account);
  return res.data;
};

export const AccountApi = {
  getAllAccounts,
  updateAccount,
};
