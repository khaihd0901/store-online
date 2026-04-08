import { Link, useNavigate } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAuthStore } from "@/stores/authStore";

function Login() {
  const navigate = useNavigate();
  const { authLogin } = useAuthStore();
  let validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: validationSchema,
    onSubmit: async (email, password) => {
      await authLogin(email, password);
      navigate("/");
    },
  });
  return (
    <div className="container mx-auto flex flex-col justify-center items-center py-8 mt-10">
      <form
        onSubmit={formik.handleSubmit}
        className="flex flex-col w-lg py-10 px-20 bg-white rounded-xl shadow"
      >
        <div className="text-2xl  w-full text-center px-8 py-4">Login</div>
        <div className="flex flex-col ">
          <label htmlFor="email" className="mb-2 text-[16px]">
            Email
          </label>
          <input
            name="email"
            type="email"
            placeholder="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="border border-gray-400 p-2 mb-4 text-sm"
            autoCapitalize="off"
          />
        </div>
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        ) : null}
        <div className="flex flex-col capitalize">
          <label htmlFor="Password" className="mb-2 text-[16px]">
            password
          </label>
          <input
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="Password"
            className="border border-gray-400 p-2 mb-4 text-sm"
          />
        </div>
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500 text-sm">{formik.errors.password}</div>
        ) : null}
        <div className="flex justify-between items-center mb-4">
          <div className="remember_me flex items-center cursor-pointer">
            <input
              id='rememberMe'
              name="rememberMe"
              checked={formik.values.rememberMe}
              onChange={formik.handleChange}
              type="checkbox"
              className="mr-1 cursor-pointer"
            />
            <label htmlFor="rememberMe" className="text-[16px] cursor-pointer select-none">
              remember me
            </label>
          </div>
          <div className="lost_password">
            <Link
              to="/forgot-password"
              className="text-[16px] text-black hover:underline"
            >
              Lost your password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          className="bg-[var(--color-febd69)] text-black p-2 hover:bg-[var(--color-fdaa3d)] hover:text-black cursor-pointer border border-gray-400 transition-smooth"
        >
          Sign In
        </button>

        <span className="py-4 text-center font-[8px] text-gray-400">
          or join with us
        </span>

        <Link
          to="/register"
          className="text-center bg-[var(--color-febd69)] text-black p-2 hover:bg-[var(--color-fdaa3d)] hover:text-black cursor-pointer border border-gray-400 transition-smooth"
        >
          Create Account
        </Link>
      </form>
    </div>
  );
}

export default Login;
