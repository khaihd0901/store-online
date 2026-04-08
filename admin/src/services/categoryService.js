
import api from "../utils/api";
const getCategories = async () => {
  const res = await api.get(`category` );
  return res.data;
};
const getCategoryById = async (id) => {
  const res = await api.get(`category/${id}` );
  return res.data;
};
const createCategory = async (data) => {
  const res = await api.post(`category/create-category`,data );
  return res.data;
};
const updateCategory = async ({id,data}) => {
  const res = await api.put(`category/update/${id}`,data );
  return res.data;
};
const deleteCategory = async (id) => {
  const res = await api.delete(`category/${id}` );
  return res.data;
};

const CategoryService = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
