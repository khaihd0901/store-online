import api from '../utils/api';
const getUserOrders = async(query)=>{
    const res = await api.get(`user/get-all-orders`, {
        params: query
    })
    return res.data
}
const adminChangeStatus = async (id,status) =>{
    const res = await api.patch(`user/orders/${id}/status`, { status })
    return res.data
}
const getOrderById = async (id) => {
    const res = await api.get(`user/orders/${id}`);
    return res.data;
  }
const orderService = {
    getUserOrders,  
    adminChangeStatus,
    getOrderById
}

export default orderService