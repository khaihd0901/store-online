

import { useEffect, useState } from "react";
import locationService from "@/services/locationService";

export default function AddressSelector({
  values,
  setFieldValue,
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // LOAD PROVINCES
  useEffect(() => {
    const fetch = async () => {
      const data = await locationService.getProvinces();
      setProvinces(data);
    };
    fetch();
  }, []);

  // LOAD DISTRICTS WHEN PROVINCE CHANGES
  useEffect(() => {
    if (!values?.provinceCode) return;

    const fetch = async () => {
      setLoadingDistricts(true);
      const data = await locationService.getDistricts(values.provinceCode);
      setDistricts(data);
      setLoadingDistricts(false);
    };

    fetch();
  }, [values?.provinceCode]);

  // LOAD WARDS
  useEffect(() => {
    if (!values?.districtCode) return;

    const fetch = async () => {
      setLoadingWards(true);
      const data = await locationService.getWards(values.districtCode);
      setWards(data);
      setLoadingWards(false);
    };

    fetch();
  }, [values?.districtCode]);

  // =========================
  // HANDLERS
  // =========================

  const handleProvinceChange = (e) => {
    const code = e.target.value;

    const province = provinces.find(p => p.code == code);

    setFieldValue("provinceCode", code);
    setFieldValue("provinceName", province?.name || "");

    // reset
    setFieldValue("districtCode", "");
    setFieldValue("districtName", "");
    setFieldValue("wardCode", "");
    setFieldValue("wardName", "");
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;

    const district = districts.find(d => d.code == code);

    setFieldValue("districtCode", code);
    setFieldValue("districtName", district?.name || "");

    // reset ward
    setFieldValue("wardCode", "");
    setFieldValue("wardName", "");
  };

  const handleWardChange = (e) => {
    const code = e.target.value;

    const ward = wards.find(w => w.code == code);

    setFieldValue("wardCode", code);
    setFieldValue("wardName", ward?.name || "");
  };

  return (
    <div className="space-y-4">

      {/* LOCATION */}
      <div className="grid grid-cols-3 gap-4">

        {/* PROVINCE */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500 mb-1">
            Province / City
          </label>
          <select
            value={values.provinceCode || ""}
            onChange={handleProvinceChange}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none
            transition"
          >
            <option value="" className="text-sm">Select province</option>
            {provinces.map((p) => (
              <option key={p.code} value={p.code} className="text-sm">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* DISTRICT */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500 mb-1">
            District
          </label>
          <select
            value={values.districtCode || ""}
            onChange={handleDistrictChange}
            disabled={!values.provinceCode}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none
            disabled:bg-gray-100 transition"
          >
            <option value="" className="text-sm">
              {loadingDistricts ? "Loading..." : "Select district"}
            </option>
            {districts.map((d) => (
              <option key={d.code} value={d.code} className="text-sm">
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* WARD */}
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500 mb-1">
            Ward
          </label>
          <select
            value={values.wardCode || ""}
            onChange={handleWardChange}
            disabled={!values.districtCode}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none
            disabled:bg-gray-100 transition"
          >
            <option value="" className="text-sm">
              {loadingWards ? "Loading..." : "Select ward"}
            </option>
            {wards.map((w) => (
              <option key={w.code} value={w.code} className="text-sm">
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* STREET */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-500 mb-1">
          Street / Detail Address
        </label>
        <input
          name="street"
          value={values.street || ""}
          onChange={(e) => setFieldValue("street", e.target.value)}
          placeholder="House number, street name..."
          className="border border-gray-300 rounded-lg px-3 py-2
          focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
        />
      </div>
    </div>
  );
}