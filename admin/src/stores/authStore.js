import { create } from "zustand";
import { toast } from "sonner";
import authService from "../services/authService"

export const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,

  setAccessToken: (token) => {
    set({
      accessToken: token,
    });
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
  authLogin: async (data) => {
    try {
      set({
        isLoading: true,
        isSuccess: false,
        isError: false,
      });
      const user = await authService.authLogin(data);
      set({isSuccess: true})
      if (user) {
        get().setAccessToken(user.accessToken);
        await get().authMe();
      }
      toast.success("Sign In Success! You Will Be Redirect To Home Page");
    } catch (err) {
      set({
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
      console.log(err.response);
      toast.error(err.response.data.message);
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  authSignOut: async () => {
    try {
      get().clearState();
      await authService.authSignOut();
      toast.success("Sign Out Success !!!");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong When Logout");
    }
  },
  authMe: async () => {
    try {
      set({ isLoading: true });
      const user = await authService.authMe();
      set({ user: user });
    } catch (err) {
      set({
        user: null,
        accessToken: null,
        isLoading: false,
        isSuccess: false,
        isError: true,
      });
      console.log(err);
      toast.error("Get Profile Failed !!!");
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  authRefreshToken: async () => {
    try {
      set({ isLoading: true });
      const { user, authMe, setAccessToken } = get();
      const accessToken = await authService.authRefreshToken();
      setAccessToken(accessToken);
      if (!user) {
        await authMe();
      }
    } catch (err) {
      console.log(err);
      toast.error("Your login session has expired, please log in again. ");
      get().clearState();
    } finally {
      set({
        isLoading: false,
      });
    }
  },
}));
