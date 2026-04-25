import { useUserStore } from "@/stores/userStore";
import { Truck, Store, ShieldCheck, TicketPercent } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import AddressSelector from "@/components/AddressSelector";

const Checkout = () => {
  const { carts } = useUserStore();
  const { user } = useAuthStore();
  const checkoutSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone is required"),

    provinceCode: Yup.string().required("Select province"),
    districtCode: Yup.string().required("Select district"),
    wardCode: Yup.string().required("Select ward"),
    street: Yup.string().required("Street is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",

      provinceCode: "",
      provinceName: "",
      districtCode: "",
      districtName: "",
      wardCode: "",
      wardName: "",
      street: "",
    },

    validationSchema: checkoutSchema,

    onSubmit: (values) => {
      console.log("CHECKOUT DATA:", values);
    },
  });

  const subtotal = carts.items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shipping = 5;
  const discount = 10;
  const total = subtotal + shipping - discount;

  useEffect(() => {
    if (!user) return;

    const addr =
      user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];

    formik.setValues({
      name: user.fullName || `${user.firstName} ${user.lastName}`,
      email: user.email || "",
      phone: user.phone || "",

      provinceCode: addr?.provinceCode || "",
      provinceName: addr?.provinceName || "",
      districtCode: addr?.districtCode || "",
      districtName: addr?.districtName || "",
      wardCode: addr?.wardCode || "",
      wardName: addr?.wardName || "",
      street: addr?.street || "",
    });
  }, [user]);
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <from
        onSubmit={formik.handleSubmit}
        className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 px-4"
      >
        {/* LEFT */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">
                Full Name
              </label>
              <input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none disabled:bg-gray-100 transition"
              />

              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">
                Email
              </label>
              <input
                name="name"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none disabled:bg-gray-100 transition"
              />

              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">
                Phone number
              </label>
              <input
                name="name"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none disabled:bg-gray-100 transition"
              />

              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm">{formik.errors.phone}</p>
              )}
            </div>

            <AddressSelector
              values={formik.values}
              setFieldValue={formik.setFieldValue}
            />
            {formik.touched.provinceCode && formik.errors.provinceCode && (
              <p className="text-red-500 text-sm">
                {formik.errors.provinceCode}
              </p>
            )}

            {formik.touched.districtCode && formik.errors.districtCode && (
              <p className="text-red-500 text-sm">
                {formik.errors.districtCode}
              </p>
            )}

            {formik.touched.wardCode && formik.errors.wardCode && (
              <p className="text-red-500 text-sm">{formik.errors.wardCode}</p>
            )}

            {formik.touched.street && formik.errors.street && (
              <p className="text-red-500 text-sm">{formik.errors.street}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input
                type="checkbox"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none disabled:bg-gray-100 transition"
              />
              I agree to Terms & Conditions
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Review your cart</h2>

          <div className="space-y-4">
            {carts.items?.map((item) => (
              <div key={item._id} className="flex gap-4">
                <img
                  src={item.prodId.images?.[0]?.url}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.prodId.title}</p>
                  <p className="text-xs text-gray-500">{item.quantity}x</p>
                </div>
                <p className="text-sm font-semibold">
                  ${item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Discount */}
          <div className="relative mt-6">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {/* Ticket icon */}
              <TicketPercent className="text-gray-700 font-bold" />
            </span>

            <input
              placeholder="Discount code"
              className="w-full border p-3 pl-10 pr-24 rounded-lg"
            />

            <button className="absolute font-medium right-2 top-1/2 -translate-y-1/2 bg-red-400 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-500">
              Apply
            </button>
          </div>

          {/* TOTAL */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Discount</span>
              <span>-${discount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-red-400 text-white py-3 rounded-xl font-medium hover:bg-red-500"
          >
            Pay Now
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
            <ShieldCheck size={16} /> Secure Checkout - SSL Encrypted
          </div>
        </div>
      </from>
    </div>
  );
};

export default Checkout;
