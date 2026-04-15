import api from "../utils/api";
const getCoupons = async () => {
  const res = await api.get(`coupon` );
  console.log("res", res.data)
  return res.data;
};
const getCouponById = async (id) => {
  const res = await api.get(`coupon/${id}` );
  return res.data;
};
const createCoupon = async (data) => {
  const res = await api.post(`coupon/create-coupon`,data );
  return res.data;
};
const updateCoupon = async ({id,data}) => {
  console.log(id)
  const res = await api.put(`coupon/update/${id}`,data );
  return res.data;
};
const deleteCoupon = async (id) => {
  const res = await api.delete(`coupon/${id}` );
  return res.data;
};

const couponService = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};

export default couponService;
