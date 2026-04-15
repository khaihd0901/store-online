import api from '../utils/api'

const getUsers = async()=>{
    const res = await api.get(`user`)
    return res.data
}
const toggleUserLock = async (userId) => {
    const res =await api.put(`/user/toggle-lock/${userId}`);
    return res.data
}
const userService = {
    getUsers,
    toggleUserLock
}

export default userService