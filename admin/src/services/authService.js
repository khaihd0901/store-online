import api from '../utils/api';
const authLogin = async (data) => {
  const res = await api.post(`auth/admin-login`, data);
  return res.data;
};

const authSignOut = async () =>{
  return await api.post(`auth/signout`);
}
const authMe = async () =>{
  const res = await api.get(`user/me`)
  return res.data
}
const authRefreshToken = async () =>{
  const res = await api.post(`auth/refresh-token`)
  return res.data.accessToken
}
const authService = {
  authLogin,
  authSignOut,
  authMe,
  authRefreshToken,
}
export default authService