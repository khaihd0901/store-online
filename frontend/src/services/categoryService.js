
import api from "@/middlewares/axios";
const getCategories = async () => {
  const res = await api.get(`category` );
  return res.data;
};
export const getCategoryById = async (id, page = 1, limit = 5) => {
  const res = await api.get(`/category/${id}`, {
    params: { page, limit },
  });
  return res.data;
};


const CategoryService = {
  getCategories,
  getCategoryById,
};

export default CategoryService;
