import {apiProduct} from "../utils/apiCaller";

const getAllProducts = async () => {
  const res = await apiProduct.get("/products");
  return res.data;
};

const createProduct = async (product) => {
  const res = await apiProduct.post("/products", product);
  return res.data;
};

const getProduct = async (id) => { 
  const res = await apiProduct.get(`/products/${id}`);
  return res.data;

}

const updateProduct = async (product) => {
  const res = await apiProduct.put(`/products/${product.productId}`, product);
  return res.data;
};

const deleteProduct = async (product) => {
  const res = await apiProduct.delete(`/products/${product._id}`);
  return res.data;
};

export const ProductApi = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
