import Modal from "../../components/TableModal/Modal";
import CustomerInput from "../../components/CustomerInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback } from "react";
import { useCategoryStore } from "../../stores/categoryStore";

export default function AddCategory({ onClose }) {
  const { categoryCreate, isSuccess, isLoading } = useCategoryStore();

  let validationSchema = Yup.object({
    categoryName: Yup.string().required("Name is required"),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      categoryName: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      categoryCreate(values);
    },
  });

  useCallback(() => {
    if (isSuccess) {
      onClose(true);
    }
  }, [isSuccess, onClose]);
  return (
    <Modal onClose={onClose} onSubmit={formik.handleSubmit}>
      {/* 🔥 RELATIVE WRAPPER */}
      <div className="relative">
        {/* 🔥 LOADING OVERLAY */}
        {/* FORM */}
        <div className="p-4 bg-gray-100 min-w-5xl">
          <div className="grid grid-cols-12 gap-4">
            {/* RIGHT */}
            <div className="col-span-12 space-y-6">
              <div className="bg-gray-100 rounded-xl border border-gray-200 shadow-xl p-4">
                <h3 className="font-semibold mb-4">General Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <CustomerInput
                      onChange={formik.handleChange("categoryName")}
                      value={formik.values.categoryName}
                      type="text"
                      label="category name"
                      i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      placeholder="Category Name"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            type="button"
            disabled={isLoading}
            className="border px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white/70 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">
              Creating Category...
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
