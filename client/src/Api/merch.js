import {apiMerch} from '../../src/utils/apiCaller';

const getAllMerch = async () => {
  const res = await apiMerch.get('/merch');
  return res.data;
};

const createMerch = async (merch) => {
  const res = await apiMerch.post('/merch', merch);
  return res.data;
};

const getMerch = async (id) => {
  const res = await apiMerch.get(`/merch/${id}`);
  return res.data;
};

const updateMerch = async (merch) => {
  const res = await apiMerch.put(`/merch/${merch.merchId}`, merch);
  return res.data;
};

const deleteMerch = async (merch) => {
  const res = await apiMerch.delete(`/merch/${merch._id}`);
  return res.data;
};

export const MerchApi = {
  getAllMerch,
  getMerch,
  createMerch,
  updateMerch,
  deleteMerch,
};
