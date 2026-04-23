// services/locationService.js
import axios from "axios";

const API = "https://provinces.open-api.vn/api/v1";

 const getProvinces = async () => {
  const res = await axios.get(API);
  return res.data;
};

 const getDistricts = async (provinceCode) => {
  const res = await axios.get(`${API}/p/${provinceCode}?depth=2`);
  return res.data.districts;
};

 const getWards = async (districtCode) => {
  const res = await axios.get(`${API}/d/${districtCode}?depth=2`);
  return res.data.wards;
};

const locationService = {
  getProvinces,
  getDistricts,
  getWards
}
export default locationService