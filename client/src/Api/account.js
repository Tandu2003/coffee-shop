import {apiAuth} from '../utils/apiCaller';

const getAllAccounts = async () => {
  try {
    console.log('Fetching all accounts...');
    const res = await apiAuth.get('/accounts');
    console.log('Accounts fetched successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error("Get all accounts error:", error.response?.data || error.message || error);
    throw error;
  }
};

const updateAccount = async (account) => {
  try {
    const res = await apiAuth.put(`/accounts/${account.email}`, { isAdmin: account.isAdmin });
    return res.data;
  } catch (error) {
    console.error("Update account error:", error);
    throw error;
  }
};

const deleteAccount = async (email) => {
  try {
    console.log('Deleting account:', email);
    const res = await apiAuth.delete(`/accounts/${email}`);
    console.log('Account deleted successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error("Delete account error:", error.response?.data || error.message || error);
    throw error;
  }
};

export const AccountApi = {
  getAllAccounts,
  updateAccount,
  deleteAccount,
};
