import api from "@/middlewares/axios";

const getProducts = async() =>{
    const res = await api.get(`products`);
    return res.data
}

const productService = {
    getProducts,
    
}

export default productService