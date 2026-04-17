import Modal from "../../components/TableModal/Modal";
import CustomerInput from "../../components/CustomerInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useUserStore } from "../../stores/userStore";

const DetailUser = ({ onClose, userId }) => {
  const { userGetById, user, userUpdate, isSuccess, isLoading } =
    useUserStore();
    console.log(user)
  useEffect(() => {
    if (userId) {
      userGetById(userId);
    }
  }, []);

  let validationSchema = Yup.object({
    name: Yup.string().required("User name is required"),
    email: Yup.string().email().required("Email is required"),
    phone: Yup.string().required("Phone is required"),
    address: Yup.string().required("Address is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await userUpdate({
        id: userId,
        data: values,
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      onClose(true);
    }
  }, [isSuccess, onClose]);

  return (
    <Modal onClose={onClose} onSubmit={formik.handleSubmit}>
      <div className="relative">
        <h2 className="text-lg font-semibold mb-4">User Detail</h2>
        <div className="p-4 bg-gray-100 min-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomerInput
              onChange={formik.handleChange("name")}
              value={formik.values.name}
              type="text"
              label="Name"
              i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="User Name"
            />
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            ) : null}

            <CustomerInput
              onChange={formik.handleChange("email")}
              value={formik.values.email}
              type="email"
              label="Email"
              i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="user@example.com"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}

            <CustomerInput
              onChange={formik.handleChange("phone")}
              value={formik.values.phone}
              type="text"
              label="Phone"
              i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Phone Number"
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="text-red-500 text-sm">{formik.errors.phone}</div>
            ) : null}

          </div>
          
            <CustomerInput
              onChange={formik.handleChange("address")}
              value={formik.values.address}
              type="text"
              label="Address"
              i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Address"
            />
            {formik.touched.address && formik.errors.address ? (
              <div className="text-red-500 text-sm">
                {formik.errors.address}
              </div>
            ) : null}
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            type="button"
            disabled={isLoading}
            className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">Loading user...</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DetailUser;
