import { useState } from "react";
import { Link } from "react-router";
import CustomerInput from "../components/CustomerInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password email:", email);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <CustomerInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="email address"
                i_class="w-full px-4 py-2 border rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all "
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[var(--color-fdaa3d)] text-white py-2 rounded-lg hover:opacity-80 cursor-pointer transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-medium">✔ Reset link sent!</p>
            <p className="text-sm text-gray-500 mt-2">
              Please check your email for further instructions.
            </p>
          </div>
        )}

        {/* Back to login */}
        <div className="mt-6 border-t pt-4 text-center">
          <Link to="/login" className="text-sm text-gray-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
