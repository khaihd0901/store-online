import Modal from "../../components/TableModal/Modal";
import CustomerInput from "../../components/CustomerInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useCouponStore } from "../../stores/couponStore";

export default function CouponDetail({ couId, onClose }) {
    const {couponGetById,couponUpdate, isSuccess, isLoading, coupon} = useCouponStore();

  useEffect(() => {
    couponGetById(couId)
  }, [couId]);

  let validationSchema = Yup.object({
    code: Yup.string().required("Code Name is required"),
    des: Yup.string().required("Description is required"),
    discountValue: Yup.number().min(1).required(),
    minPurchaseAmount: Yup.number().min(0).required(),
    maxUses: Yup.number().min(1).required(),
    expiryDate: Yup.date().required("Expiry date is required"),
    isActive: Yup.boolean(),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      code: coupon?.code || "",
      des: coupon?.des || "",
      discountValue: coupon?.discountValue || 0,
      minPurchaseAmount: coupon?.minPurchaseAmount || 0,
      maxUses: coupon?.maxUses || 0,
      expiryDate: coupon?.expiryDate|| '',
      isActive: coupon?.isActive || false,
    },
    validationSchema,
    onSubmit: async (values) => {
        couponUpdate({
          id: couId,
          data: values,
        })
    }
  });

  useEffect(()=>{
    if(isSuccess){
      onClose(true);
    }
  },[])
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
                  <div className="grid grid-cols-2 gap-4">
                    <CustomerInput
                      onChange={formik.handleChange("code")}
                      value={formik.values.code}
                      type="text"
                      label="coupon code"
                      i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      placeholder="Product Name"
                    />

                    <CustomerInput
                      onChange={formik.handleChange("des")}
                      value={formik.values.des}
                      type="text"
                      label="coupon description"
                      i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      placeholder="Product Name"
                    />
                    {formik.touched.code && formik.errors.code && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.code}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <CustomerInput
                      onChange={formik.handleChange("discountValue")}
                      value={formik.values.discountValue}
                      type="number"
                      label="discount value"
                      placeholder="Type and enter"
                      i_class="w-full mb-3 pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                    />
                    <CustomerInput
                      onChange={formik.handleChange("minPurchaseAmount")}
                      value={formik.values.minPurchaseAmount}
                      type="number"
                      label="min purchase amount"
                      placeholder="Type and enter"
                      i_class="w-full mb-3 pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                    />

                    <CustomerInput
                      onChange={formik.handleChange("maxUses")}
                      value={formik.values.maxUses}
                      type="number"
                      label="max uses"
                      placeholder="Type and enter"
                      i_class="w-full mb-3 pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <CustomerInput
                      onChange={formik.handleChange("expiryDate")}
                      value={formik.values.expiryDate}
                      type="date"
                      label="expiry date"
                      i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                    />

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        {formik.values.isActive ? "Active" : "Inactive"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          formik.setFieldValue(
                            "isActive",
                            !formik.values.isActive,
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
          ${formik.values.isActive ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition
            ${formik.values.isActive ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button>
                    </div>
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
            Close
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Update
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white/70 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">
              Creating coupon...
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}