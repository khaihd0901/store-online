import { useAuthStore } from "@/stores/authStore";
import { useAddressStore } from "@/stores/addressStore";
import { useEffect, useState } from "react";
import PopupModal from "@/components/PopupModal";
import AddressSelector from "@/components/AddressSelector";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useUserStore } from "@/stores/userStore";
export default function UserProfile() {
  const { user, authSignOut, authMe } = useAuthStore();
  const {
    addresses,
    selectedAddress,
    addressGetAll,
    setSelectedAddress,
    deleteAddress,
    setDefaultAddress,
    addAddress,
  } = useAddressStore();
  const {userUpdate} = useUserStore();
  const defaultAddress = addresses.find((addr) => addr.isDefault);
  const [activeTab, setActiveTab] = useState("profile");
  const [showForm, setShowForm] = useState(false);

  const addressSchema = Yup.object({
    fullName: Yup.string()
      .required("Full name is required")
      .min(2, "Too short"),

    phone: Yup.string()
      .required("Phone is required")
      .matches(/^(0|\+84)[0-9]{9}$/, "Invalid Vietnam phone"),

    street: Yup.string().required("Street is required"),

    provinceName: Yup.string().required("Select province"),
    districtName: Yup.string().required("Select district"),
    wardName: Yup.string().required("Select ward"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      street: "",
      provinceCode: "",
      districtCode: "",
      wardCode: "",
      provinceName: "",
      districtName: "",
      wardName: "",
    },

    validationSchema: addressSchema,

    onSubmit: async (values, { resetForm }) => {
      await addAddress(values);
      resetForm();
      setShowForm(false);
    },
  });

  const personalFormik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      firstName: Yup.string().required("first name is required"),
      lastName: Yup.string().required("last name is required"),

      phone: Yup.string()
        .required("Phone is required")
        .matches(/^(0|\+84)[0-9]{9}$/, "Invalid phone"),
    }),

    onSubmit: async (values) => {
      await userUpdate(user._id,values);
      await authMe();
    },
  });
  useEffect(() => {
    addressGetAll();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <div className="col-span-3 bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-3 mb-6">
            <img
              src="https://i.pravatar.cc/100"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold">{user?.fullName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === "profile" && "bg-gray-100 font-medium"
              }`}
            >
              Profile
            </button>

            <button
              onClick={() => setActiveTab("address")}
              className={`w-full text-left px-3 py-2 rounded ${
                activeTab === "address" && "bg-gray-100 font-medium"
              }`}
            >
              Manage Address
            </button>

            <button
              onClick={authSignOut}
              className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="col-span-9 space-y-6">
          {/* ================= PROFILE TAB ================= */}
          {activeTab === "profile" && (
            <form onSubmit={personalFormik.handleSubmit} className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">
                Profile Information
              </h2>

              <div  className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">First Name</label>
                  <input
                    name="firstName"
                    value={personalFormik.values.firstName}
                    onChange={personalFormik.handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none
            transition"
                  />
                  {personalFormik.touched.firstName &&
                    personalFormik.errors.firstName && (
                      <p className="text-red-500 text-sm">
                        {personalFormik.errors.firstName}
                      </p>
                    )}
                </div>
                <div>
                  <label className="text-sm text-gray-600">Last Name</label>
                  <input
                    name="lastName"
                    value={personalFormik.values.lastName}
                    onChange={personalFormik.handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none
            transition"
                  />
                  {personalFormik.touched.lastName &&
                    personalFormik.errors.lastName && (
                      <p className="text-red-500 text-sm">
                        {personalFormik.errors.lastName}
                      </p>
                    )}
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <input
                    value={user?.email}
                    disabled
                    className="w-full bg-gray-200 border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none
            transition cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Phone</label>
                  <input
                    name="phone"
                    value={personalFormik.values.phone}
                    onChange={personalFormik.handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none
            transition"
                    placeholder="Your phone number"
                  />
                  {personalFormik.touched.phone &&
                    personalFormik.errors.phone && (
                      <p className="text-red-500 text-sm">
                        {personalFormik.errors.phone}
                      </p>
                    )}
                </div>
              </div>

              <div className="mt-3">
                <label className="text-sm text-gray-600">Default Address</label>
                <input
                  value={
                    defaultAddress
                      ? `${defaultAddress.street}, ${defaultAddress.wardName}, ${defaultAddress.districtName}, ${defaultAddress.provinceName}`
                      : "No address"
                  }
                  disabled
                  className="w-full bg-gray-200 border border-gray-300 rounded-lg px-3 py-2 text-sm
            focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none
            transition cursor-not-allowed"
                />
              </div>
              <button type="submit" className="mt-4 w-full bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500">
                Save
              </button>
            </form>
          )}

          {/* ================= ADDRESS TAB ================= */}
          {activeTab === "address" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">My Addresses</h2>

              {/* SELECTED */}
              {selectedAddress && (
                <div className="mb-4 border p-3 rounded bg-gray-50">
                  <p className="font-medium">
                    {selectedAddress.fullName} - {selectedAddress.phone}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedAddress.street}, {selectedAddress.wardName},{" "}
                    {selectedAddress.districtName},{" "}
                    {selectedAddress.provinceName}
                  </p>
                </div>
              )}

              {/* LIST */}
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddress(addr._id)}
                    className={`border p-4 rounded-lg cursor-pointer ${
                      selectedAddress?._id === addr._id
                        ? "border-black bg-gray-50"
                        : ""
                    }`}
                  >
                    <p className="font-medium">
                      {addr.fullName} - {addr.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      {addr.street}, {addr.wardName}, {addr.districtName},{" "}
                      {addr.provinceName}
                    </p>

                    <div className="flex gap-2 mt-2">
                      {!addr.isDefault && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDefaultAddress(addr._id);
                          }}
                          className="text-sm border px-2 py-1 rounded"
                        >
                          Set Default
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAddress(addr._id);
                        }}
                        className="text-sm text-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* ADD */}
              {addresses.length < 3 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-red-400 font-medium text-white px-4 py-2 rounded hover:bg-red-500"
                >
                  + Add Address
                </button>
              )}

              {/* FORM */}
              {showForm && (
                <PopupModal
                  title={"Add Location"}
                  onClose={() => setShowForm(false)}
                >
                  <form
                    onSubmit={formik.handleSubmit}
                    className="space-y-3 px-2 py-3"
                  >
                    {/* FULL NAME */}
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">
                        Full Name
                      </label>
                      <input
                        name="fullName"
                        placeholder="Full Name"
                        onChange={formik.handleChange}
                        value={formik.values.fullName}
                        className="border border-gray-300 rounded-lg px-3 py-2
        focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                      />
                      {formik.errors.fullName && formik.touched.fullName && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* PHONE */}
                    <div className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        placeholder="Phone Number"
                        onChange={formik.handleChange}
                        value={formik.values.phone}
                        className="border border-gray-300 rounded-lg px-3 py-2
        focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none transition"
                      />
                      {formik.errors.phone && formik.touched.phone && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.phone}
                        </p>
                      )}
                    </div>

                    {/* ADDRESS SELECTOR */}
                    <AddressSelector
                      values={formik.values}
                      setFieldValue={formik.setFieldValue}
                      setFieldTouched={formik.setFieldTouched}
                    />

                    {/* ERROR */}
                    {formik.errors.provinceName &&
                      formik.touched.provinceName && (
                        <p className="text-red-500 text-sm">
                          {formik.errors.provinceName}
                        </p>
                      )}

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          formik.resetForm(); // 🔥 important
                        }}
                        className="border px-4 py-2 rounded hover:bg-gray-300 font-medium"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="bg-red-400 text-white px-4 py-2 font-medium rounded hover:bg-red-500"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </PopupModal>
              )}
            </div>
          )}

          {/* ================= ORDERS TAB ================= */}
          {activeTab === "orders" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Orders</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          )}

          {/* ================= WISHLIST TAB ================= */}
          {activeTab === "wishlist" && (
            <div className="bg-white p-6 rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-4">Wishlist</h2>
              <p className="text-gray-500">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
