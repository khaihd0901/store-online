import { create } from "zustand";
import userService from "@/services/userService";

export const useUserStore = create((set) => ({
  isLoading: false,
  error: null,
  success: null,
  step: 1,
  email: "",
  userForgotPasswordOTP: async (emailData) => {
    try {
      set({ isLoading: true, error: null });

      const res = await userService.userForgotPasswordOTP(emailData);

      set({
        isLoading: false,
        success: res.message,
        email: emailData.email,
        step: 2,
      });

    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to send OTP",
      });
    }
  },

  userVerifyOTP: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await userService.userVerifyOTP(data);

      set({
        isLoading: false,
        success: res.message,
        step: 3,
      });

    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Invalid OTP",
      });
    }
  },
  userResetPassword: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await userService.userResetPassword(data);

      set({
        isLoading: false,
        success: res.message,
        step: 1,
        email: "",
      });

    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Reset failed",
      });
    }
  },
  clearState: () => {
    set({
      step: 1,
      email: "",
      error: null,
      success: null,
    });
  },
}));