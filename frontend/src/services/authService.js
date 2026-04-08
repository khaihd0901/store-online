import api from '../lib/axios';


const authSignUp = async (data) => {
  const res = await api.post(`auth/signup`, data);
  return res.data
};
const authLogin = async (data) => {
  const res = await api.post(`auth/signin`, data);
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
  authSignUp,
  authLogin,
  authSignOut,
  authMe,
  authRefreshToken,
}
export default authService