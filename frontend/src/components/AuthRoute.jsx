import { Navigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";

export default function AuthRoute({ children }) {
  const { user, accessToken } = useAuthStore();

  if (user || accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}