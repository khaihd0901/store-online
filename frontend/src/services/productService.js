import api from "@/middlewares/axios";

const getProducts = async() =>{
    const res = await api.get(`products`);
    return res.data
}

const searchProducts = async (query) => {
  const res = await api.get("product/search", {
    params: query,
  })
  return res.data;
};

const productService = {
    getProducts,
    searchProducts
}

export default productService