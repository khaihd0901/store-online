import api from "@/middlewares/axios"

const userForgotPasswordOTP = async (email) =>{
    const res = await api.post(`user/forgot-password`, email)
    return res.data
}

const userVerifyOTP = async (data) =>{
    const res = api.post(`user/verify-otp`, data)
    return res.data
}
const userResetPassword = async (data) =>{
    const res = api.post(`user/reset-password`, data)
    return res.data
}
const userService = {
    userForgotPasswordOTP,
    userVerifyOTP,
    userResetPassword
}

export default userService