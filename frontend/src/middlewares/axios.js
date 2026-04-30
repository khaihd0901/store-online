import axios from "axios";

import { useAuthStore } from "@/stores/authStore";

//const base_url = import.meta.env.VITE_BASE_URL
const base_url = "http://localhost:5001/api/";
const api = axios.create({
  baseURL: base_url,
  withCredentials: true,
});

// =========================
// REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// =========================
// RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // ❗ if no config → stop
    if (!originalRequest) return Promise.reject(error);

    // ❗ skip auth endpoints
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // retry count
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // =========================
    // REFRESH TOKEN LOGIC
    // =========================
    if (
      error.response?.status === 403 &&
      originalRequest._retryCount < 1 // 🔥 only retry ONCE (best practice)
    ) {
      originalRequest._retryCount += 1;

      try {
        const res = await api.post("/auth/refresh-token");

        const newAccessToken = res.data.accessToken;

        // ✅ FIX Zustand call
        useAuthStore.getState().setAccessToken(newAccessToken);

        // update header
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // ❗ logout if refresh fails
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;