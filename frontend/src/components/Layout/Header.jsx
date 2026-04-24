import { useAuthStore } from "@/stores/authStore";
import React, { useState } from "react";
import { Link } from "react-router";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LogOut, PackageIcon, SettingsIcon, UserIcon } from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { toast } from "sonner";

const Header = () => {
  const { user, authSignOut, authSignUp, isLoading,authLogin,isLoginOpen, openLogin, closeLogin } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("signin");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const { userForgotPasswordOTP, userVerifyOTP, userResetPassword,userGetWishlist,userGetCart,wishlistCount, clearState } =
    useUserStore();
const cartCount = useUserStore((state) => state.cartCount);
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
    onSubmit: async (values) => {
      try{
      const res = await authLogin(values);
      await userGetWishlist();
      await userGetCart();
      if(res){
      window.location.reload();
      }
      }catch(err){
        toast.error(err)
      }
    },
  });

  const registerFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Min 6 characters")
        .required("Password is required"),
      firstName: Yup.string().required("First name is required"),
      lastName: Yup.string().required("Last name is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await authSignUp(values);

        resetForm();
        setRegisterSuccess(
          "Registration successful! Please check your email to verify your account.",
        );
      } catch (err) {
        console.log(err);
        setRegisterSuccess("Registration failed. Please try again.");
      }
    },
  });

  const forgotFormik = useFormik({
    initialValues: { email: "" },
    onSubmit: async (values) => {
      await userForgotPasswordOTP(values);
      setEmail(values.email);
      setStep(2);
    },
  });

  const otpFormik = useFormik({
    initialValues: { OTP: "" },
    onSubmit: async (values) => {
      await userVerifyOTP({
        email,
        OTP: values.OTP,
      });
      setStep(3);
    },
  });

  const resetFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6).required(),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required(),
    }),
    onSubmit: async (values) => {
      await userResetPassword({
        email,
        OTP: otpFormik.values.OTP,
        password: values.password,
      });

      setShowForgot(false);
      setStep(1);
    },
  });
  const handleSignOut = async () =>{
    await authSignOut();
    clearState();
  }
  return (
    <>
      <header id="header" className="site-header z-40 bg-white sticky top-0">
        {/* Main Navigation */}
        <nav
          id="header-nav"
          className="py-6 border-b border-gray-100 shadow-sm"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link className="navbar-brand" to="/">
                <img
                  src="/images/main-logo.png"
                  className="logo h-10"
                  alt="Bookly Logo"
                />
              </Link>

              {/* Nút Hamburger cho Mobile */}
              <button
                className="md:hidden p-2"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6">
                  <use xlinkHref="#navbar-icon"></use>
                </svg>
              </button>

              {/* Menu Desktop (Đã xóa Blogs và Pages) */}
              <div className="hidden md:flex items-center">
                <ul className="flex space-x-8 uppercase">
                  <li>
                    <Link
                      className="text-gray-900 hover:text-red-500 font-semibold tracking-wider text-sm"
                      to="/"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-900 hover:text-red-500 font-semibold tracking-wider text-sm"
                      to="/about"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-900 hover:text-red-500 font-semibold tracking-wider text-sm"
                      to="/shop"
                    >
                      Shop
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-gray-900 hover:text-red-500 font-semibold tracking-wider text-sm"
                      to="/contact"
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Các Icon bên phải */}
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  to="/wish-list"
                  className="text-gray-900 hover:text-red-500 flex items-center transition-colors"
                >
                  <svg className="w-5 h-5">
                    <use xlinkHref="#heart"></use>
                  </svg>
                  <span className="text-xs font-bold ml-1">({wishlistCount})</span>
                </Link>
                <Link
                  to="/cart"
                  className="text-gray-900 hover:text-red-500 flex items-center transition-colors"
                >
                  <svg className="w-5 h-5">
                    <use xlinkHref="#cart"></use>
                  </svg>
                  <span className="text-xs font-bold ml-1">({cartCount})</span>
                </Link>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                          openLogin();
                      setUserModalOpen(true);
                    } else {
                      setDropdownOpen((prev) => !prev);
                    }
                  }}
                  className="text-gray-900 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5">
                    <use xlinkHref="#user"></use>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            <img src="/images/main-logo.png" className="h-8" alt="Logo" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-500 hover:text-red-500"
          >
            <svg className="w-6 h-6">
              <use xlinkHref="#close"></use>
            </svg>
          </button>
        </div>
        <div className="p-6">
          <ul className="space-y-6 uppercase font-semibold text-sm tracking-wider">
            <li>
              <Link
                className="block text-gray-900 hover:text-red-500"
                to="/"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="block text-gray-900 hover:text-red-500"
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className="block text-gray-900 hover:text-red-500"
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                className="block text-gray-900 hover:text-red-500"
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Nền đen mờ khi mở Modal hoặc Mobile Menu */}
      {(mobileMenuOpen || userModalOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            setMobileMenuOpen(false);
            setUserModalOpen(false);
          }}
        ></div>
      )}

      {/* User Modal */}
      {isLoginOpen && !user ? (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0"
            onClick={() => setUserModalOpen(false)}
          ></div>

          <div className="bg-white rounded-xl w-full max-w-md relative z-10 shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="flex justify-end p-4 pb-0">
              <button
                onClick={closeLogin}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-6 h-6">
                  <use xlinkHref="#close"></use>
                </svg>
              </button>
            </div>

            <div className="px-8 pb-8">
              <nav className="flex justify-center border-b border-gray-200 mb-8">
                <button
                  onClick={() => setActiveTab("signin")}
                  className={`px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-colors ${activeTab === "signin" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-gray-900"}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab("register")}
                  className={`px-6 py-3 font-semibold text-sm uppercase tracking-wider transition-colors ${activeTab === "register" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-gray-900"}`}
                >
                  Register
                </button>
              </nav>

              {activeTab === "signin" && (
                <>
                  {!showForgot ? (
                    // 🔐 LOGIN FORM
                    <form
                      onSubmit={formik.handleSubmit}
                      className="animate-fade-in"
                    >
                      <div className="mb-5">
                        {" "}
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {" "}
                          Username or email address *{" "}
                        </label>{" "}
                        <input
                          type="text"
                          placeholder="Enter your email"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                          {...formik.getFieldProps("email")}
                        />{" "}
                        {formik.touched.email && formik.errors.email ? (
                          <div className="text-red-500 text-sm">
                            {" "}
                            {formik.errors.email}{" "}
                          </div>
                        ) : null}{" "}
                      </div>{" "}
                      <div className="mb-5">
                        {" "}
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                          {" "}
                          Password *{" "}
                        </label>{" "}
                        <input
                          type="password"
                          placeholder="Enter your password"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                          {...formik.getFieldProps("password")}
                        />{" "}
                        {formik.touched.password && formik.errors.password ? (
                          <div className="text-red-500 text-sm">
                            {" "}
                            {formik.errors.password}{" "}
                          </div>
                        ) : null}{" "}
                      </div>
                      <div className="flex items-center justify-between mb-6">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formik.values.rememberMe}
                            onChange={formik.handleChange}
                            className="w-4 h-4 text-red-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-600">
                            Remember me
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-sm font-semibold text-red-500 hover:text-red-600"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-semibold hover:bg-red-500"
                      >
                        Login
                      </button>
                    </form>
                  ) : (
<div className="animate-fade-in">
  {/* Title */}
  <h3 className="text-lg font-semibold text-center mb-2">
    {step === 1 && "Reset your password"}
    {step === 2 && "Enter OTP"}
    {step === 3 && "Create new password"}
  </h3>

  <p className="text-sm text-gray-500 text-center mb-6">
    {step === 1 && "Enter your email to receive a verification code"}
    {step === 2 && `We sent a code to ${email}`}
    {step === 3 && "Set your new password below"}
  </p>

  {/* STEP 1 */}
  {step === 1 && (
    <form onSubmit={forgotFormik.handleSubmit}>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          {...forgotFormik.getFieldProps("email")}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-semibold hover:bg-red-500 transition"
      >
        Send OTP
      </button>
    </form>
  )}

  {/* STEP 2 */}
  {step === 2 && (
    <form onSubmit={otpFormik.handleSubmit}>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Verification Code
        </label>
        <input
          type="text"
          placeholder="Enter OTP"
          {...otpFormik.getFieldProps("OTP")}
          className="w-full p-3 border border-gray-300 rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-semibold hover:bg-red-500 transition"
      >
        Verify OTP
      </button>

      <button
        type="button"
        onClick={() => setStep(1)}
        className="mt-3 w-full text-sm text-gray-500 hover:text-red-500"
      >
        Resend OTP
      </button>
    </form>
  )}

  {/* STEP 3 */}
  {step === 3 && (
    <form onSubmit={resetFormik.handleSubmit}>
      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          {...resetFormik.getFieldProps("password")}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
        />
      </div>

      <div className="mb-5">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          type="password"
          placeholder="Confirm password"
          {...resetFormik.getFieldProps("confirmPassword")}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gray-900 text-white py-3.5 rounded-lg font-semibold hover:bg-red-500 transition"
      >
        Reset Password
      </button>
    </form>
  )}

  {/* BACK BUTTON */}
  <button
    onClick={() => {
      setShowForgot(false);
      setStep(1);
    }}
    className="mt-6 w-full text-sm text-gray-500 hover:text-red-500"
  >
    ← Back to Login
  </button>
</div>
                  )}
                </>
              )}

              {activeTab === "register" &&
                (registerSuccess ? (
                  <div className="text-center p-6">
                    <div className="mb-4 text-green-600 text-3xl">✅</div>
                    <h3 className="text-lg font-semibold mb-2">
                      Registration Successful
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Please check your email to verify your account.
                    </p>

                    <button
                      onClick={() => {
                        setRegisterSuccess("");
                        setActiveTab("signin");
                      }}
                      className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-red-500 transition"
                    >
                      Go to Login
                    </button>
                  </div>
                ) : (
                  <form
                    className="animate-fade-in"
                    onSubmit={registerFormik.handleSubmit}
                  >
                    <div className="mb-5">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Your email address *
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        {...registerFormik.getFieldProps("email")}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />

                      {registerFormik.touched.email &&
                        registerFormik.errors.email && (
                          <div className="text-red-500 text-sm">
                            {registerFormik.errors.email}
                          </div>
                        )}
                    </div>

                    <div className="mb-5">
                      <div className="flex justify-between gap-2">
                        <div className="">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            First Name *
                          </label>
                          <input
                            type="text"
                            placeholder="First name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                            {...registerFormik.getFieldProps("firstName")}
                          />
                          {registerFormik.touched.firstName &&
                          registerFormik.errors.firstName ? (
                            <div className="text-red-500 text-sm">
                              {registerFormik.errors.firstName}
                            </div>
                          ) : null}
                        </div>
                        <div className="">
                          <label className="block mb-2 text-sm font-medium text-gray-700">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            placeholder="Last name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
                            {...registerFormik.getFieldProps("lastName")}
                          />
                          {registerFormik.touched.lastName &&
                          registerFormik.errors.lastName ? (
                            <div className="text-red-500 text-sm">
                              {registerFormik.errors.lastName}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="mb-5">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Password *
                      </label>
                      <input
                        type="password"
                        placeholder="Create a password"
                        {...registerFormik.getFieldProps("password")}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />

                      {registerFormik.touched.password &&
                        registerFormik.errors.password && (
                          <div className="text-red-500 text-sm">
                            {registerFormik.errors.password}
                          </div>
                        )}
                    </div>

                    <div className="mb-5">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Confirm Password *
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        {...registerFormik.getFieldProps("confirmPassword")}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />

                      {registerFormik.touched.confirmPassword &&
                        registerFormik.errors.confirmPassword && (
                          <div className="text-red-500 text-sm">
                            {registerFormik.errors.confirmPassword}
                          </div>
                        )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-3.5 rounded-lg font-semibold transition-colors shadow-md
    ${
      isLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gray-900 text-white hover:bg-red-500 hover:shadow-lg"
    }
  `}
                    >
                      {isLoading ? "Registering..." : "Register"}
                    </button>
                  </form>
                ))}
            </div>
          </div>
        </div>
      ) : (
        user &&
        dropdownOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute right-30 mt-4 w-62 bg-white rounded-xl shadow-2xl p-5 z-50 animate-fade-in-up"
          >
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-red-400 font-medium">My Account</h3>
              <p className="text-gray-500 text-sm truncate">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="space-y-3">
              <Link
                to={"/profile"}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
              >
                <UserIcon className="" size={22} />
                <span>Profile</span>
              </Link>

              <Link
                to={"/orders"}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
              >
                <PackageIcon className="" size={22} />
                <span> Orders</span>
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t my-4"></div>

            {/* Logout */}
            <button
              className="w-full text-left px-3 py-2 rounded-lg text-red-500 hover:bg-red-50 transition flex items-center gap-2"
              onClick={handleSignOut}
            >
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          </div>
        )
      )}
    </>
  );
};

export default Header;
