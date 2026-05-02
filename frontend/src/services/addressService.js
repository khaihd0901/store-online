import api from "@/middlewares/axios";


const userGetAddress = async() =>{
    const res = await api.get(`user/address`);
    return res.data
}
const userAddAddress = async (data) => {
  const res = await api.post(`user/add-address`,data);
    return res.data
};

const userSetDefaultAddress = async (id) => {
  const res = await api.put(`user/address/default/${id}`);
    return res.data
};

const userDeleteAddress = async (id) => {
  const res = await api.delete(`user/address/${id}`);
    return res.data
};
const addressService = {
    userGetAddress,
    userAddAddress,
    userSetDefaultAddress,
    userDeleteAddress
}

export default addressService