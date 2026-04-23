import api from "@/middlewares/axios";

const getProducts = async () => {
  const res = await api.get(`products`);
  return res.data;
};

const searchProducts = async (query) => {
  const res = await api.get("product/search", {
    params: query,
  });
  return res.data;
};

const getProductById = async (id) => {
  const res = await api.get(`product/${id}`);
  return res.data;
};

const productService = {
  getProducts,
  searchProducts,
  getProductById,
};

export default productService;