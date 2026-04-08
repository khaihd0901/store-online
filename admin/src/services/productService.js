// import axios from 'axios'
import api from "../utils/api";
const getProducts = async () => {
  const res = await api.get(`product`);
  return res.data;
};
const uploadProductImage = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("images", file);
  });
  const res = await api.put(`product/upload`, formData);
  return res.data
};

const createProduct = async (data) => {
  const res = await api.post(`product/create-product`, data);
  return res.data;
};

const getProductById = async (id) => {
  const res = await api.get(`product/${id}`);
  return res.data;
};

const updateProduct = async ({id,data}) => {
    console.log("id", id)
  const res = await api.put(`product/update/${id}`, data);
  return res.data;
};

const deleteProductById = async (id) => {
  const res = await api.delete(`product/${id}`);
  return res.data;
};

const productService = {
  getProducts,
  createProduct,
  uploadProductImage,
  updateProduct,
  getProductById,
  deleteProductById,
};

export default productService;
