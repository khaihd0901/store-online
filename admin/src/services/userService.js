import api from '../utils/api'

const getUsers = async()=>{
    const res = await api.get(`user`)
    return res.data
}
const getUserById = async(userId)=>{
    const res = await api.get(`user/${userId}`)
    return res.data
}
const updateUser = async({id,data})=>{
    const res = await api.put(`user/update/${id}`,data)
    return res.data
}
const deleteUser = async(userId)=>{
    const res = await api.delete(`user/${userId}`)
    return res.data
}
const restoreUser = async(userId)=>{
    const res = await api.put(`user/restore/${userId}`)
    return res.data
}
const getDeletedUsers = async()=>{
    const res = await api.get(`user/deleted/all`)
    return res.data
}
const toggleUserLock = async (userId) => {
    const res =await api.put(`/user/toggle-lock/${userId}`);
    return res.data
}
 const searchAdmin = async (type, keyword) => {
  const res = await api.get(`user/search/${type}?q=${keyword}`);
  return res.data;
};
const userService = {
    getUsers,
    toggleUserLock,
    getUserById,
    updateUser,
    deleteUser,
    restoreUser,
    getDeletedUsers,
    searchAdmin
}

export default userService