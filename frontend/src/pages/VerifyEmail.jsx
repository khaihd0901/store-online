import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    authVerifyEmail,
    isLoading,
    isSuccess,
    isError,
    message,
  } = useAuthStore();

  useEffect(() => {
    if (token) authVerifyEmail(token);
  }, [token]);

  // ✅ REDIRECT AFTER 3s
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center max-w-md">
        
        {isLoading && (
          <>
            <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4" />
            <p>Verifying your email...</p>
          </>
        )}

        {isSuccess && (
          <>
            <div className="text-green-500 text-4xl mb-3">✅</div>
            <h2 className="text-lg font-semibold">Success</h2>
            <p className="text-gray-600 mt-2">{message}</p>

            {/* 👇 USER KNOWS REDIRECT */}
            <p className="text-sm text-gray-400 mt-2">
              Redirecting to homepage in 3 seconds...
            </p>
          </>
        )}

        {isError && (
          <>
            <div className="text-red-500 text-4xl mb-3">❌</div>
            <h2 className="text-lg font-semibold">Verification Failed</h2>
            <p className="text-gray-600 mt-2">{message}</p>
          </>
        )}
      </div>
    </div>
  );
}