
import api from "../utils/api";
const getBrands = async () => {
  const res = await api.get(`brand` );
  return res.data;
};
const getBrandById = async (id) => {
  const res = await api.get(`brand/${id}` );
  return res.data;
};
const createBrand = async (data) => {
  const res = await api.post(`brand/create-brand`,data );
  return res.data;
};
const updateBrand = async ({id,data}) => {
  const res = await api.put(`brand/update/${id}`,data );
  return res.data;
};
const deleteBrand = async (id) => {
  const res = await api.delete(`brand/${id}` );
  return res.data;
};

const brandService = {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};

export default brandService;
