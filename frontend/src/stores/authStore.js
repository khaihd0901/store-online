import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import authService from "@/services/authService";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isLoading: false,
      isSuccess: false,
      isError: false,

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          isLoading: false,
          isSuccess: false,
          isError: false,
        });
      },

      authSignUp: async (data) => {
        try {
          set({ isLoading: true, isError: false });
          await authService.authSignUp(data);
          toast.success("Sign Up Success!");
        } catch (err) {
          console.log(err)
          set({ isError: true });
        } finally {
          set({ isLoading: false });
        }
      },

      authLogin: async (data) => {
        try {
          set({ isLoading: true, isError: false });
          const user = await authService.authLogin(data);

          if (user) {
            get().setAccessToken(user.accessToken);
            await get().authMe();
          }

          toast.success("Sign In Success!");
        } catch (err) {
          set({ isError: true });
          toast.error(err.response?.data?.message);
        } finally {
          set({ isLoading: false });
        }
      },

      authSignOut: async () => {
        try {
          get().clearState();
          await authService.authSignOut();
          toast.success("Sign Out Success!");
        } catch (err) {
          console.log(err)
          toast.error("Logout failed");
        }
      },

      authMe: async () => {
        try {
          set({ isLoading: true });
          const user = await authService.authMe();
          set({ user });
        } catch (err) {
          console.log(err)
          get().clearState();
        } finally {
          set({ isLoading: false });
        }
      },

      authRefreshToken: async () => {
        try {
          const accessToken = await authService.authRefreshToken();
          get().setAccessToken(accessToken);

          if (!get().user) {
            await get().authMe();
          }
        } catch (err) {
          console.log(err)
          get().clearState();
        }
      },
    }),
    {
      name: "auth-storage", 
      partialize: (state) => ({
        // accessToken: state.accessToken,
        user: state.user,
      }),
    }
  )
);