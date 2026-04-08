import api from '../utils/api'

const getUsers = async()=>{
    const res = await api.get(`user`)
    return res.data
}

const userService = {
    getUsers
}

export default userService