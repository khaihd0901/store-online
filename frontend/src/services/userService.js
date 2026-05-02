import api from "@/middlewares/axios"

const userGetUserById = async (id) =>{
    const res = await api.get(`user/${id}`)
    return res.data
}
const userUpdate = async (id,data) =>{
    const res = await api.put(`user/update/${id}`,data);
    return res.data
}
const userForgotPasswordOTP = async (email) =>{
    const res = await api.post(`user/forgot-password`, email)
    return res.data
}

const userVerifyOTP = async (data) =>{
    const res = await api.post(`user/verify-otp`, data)
    return res.data
}
const userResetPassword = async (data) =>{
    const res = await api.post(`user/reset-password`, data)
    return res.data
}
const userGetWishlist = async () =>{
    const res = await api.get(`user/wishlist`)
    return res.data.wishList
}
const userAddToWishlist = async (productId) =>{
    console.log(productId)
    const res = await api.post(`user/add-wishlist`, {prodId : productId})
    return res.data
}
const userRemoveFromWishlist = async (productId) =>{
    const res = await api.put(`user/remove-wishlist`, { prodId: productId })
    return res.data
}
const userMergeCart = async (cartData) =>{
    console.log(cartData)
    const res = await api.post(`user/merge-cart`,cartData);
    return res.data
}
const userAddToCart = async (cartData) =>{
    console.log(cartData)
    const res = await api.post(`user/cart`, cartData)
    return res.data
}
const userGetCart = async () =>{
    const res = await api.get(`user/get-cart`)
    return res.data
}
const userRemoveItemFromCart = async (productId) =>{
    const res = await api.post('user/delete-item', {prodId: productId})
    return res.data
}
const userUpdateQuantity = async (cartData) =>{
    const res = await api.put('user/update-quantity', cartData)
    return res.data
}
const userApplyCoupon = async (coupon) =>{
    const res = await api.post('user/apply-coupon', coupon)
    return res.data
}
const userRemoveCoupon = async () =>{
    const res = await api.put('user/remove-coupon')
    return res.data
}
const userCreateOrder = async (data) =>{
    const res = await api.post('user/create-order', data)
    return res.data
}

const userGetOrders = async (params = {}) =>{
    const res = await api.get('user/get-order', { params })
    return res.data
}
const userService = {
    userUpdate,
    userGetUserById,
    userForgotPasswordOTP,
    userVerifyOTP,
    userResetPassword,
    userAddToWishlist,
    userRemoveFromWishlist,
    userGetWishlist,
    userAddToCart,
    userGetCart,
    userRemoveItemFromCart,
    userUpdateQuantity,
    userMergeCart,
    userApplyCoupon,
    userRemoveCoupon,
    userCreateOrder,
    userGetOrders
}

export default userService