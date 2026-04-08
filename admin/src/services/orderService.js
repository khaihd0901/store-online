import api from '../utils/api';
const getUserOrders = async()=>{
    const res = await api.get(`user/get-all-orders`)
    return res.data
}

const orderService = {
    getUserOrders,  
}

export default orderService