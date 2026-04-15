import { create } from "zustand";
import { toast } from "sonner";
import userService from "../services/userService";

export const useUserStore = create((set, get) => ({
  users: [],
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,

  setUsers: (data) => {
    set({
      users: data,
    });
  },
  setUser: (data) => {
    set({
      user: data,
    });
  },
  clearState: () => {
    set({
      products: [],
      product: null,
      images: [],
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  },
  userGetAll: async () => {
    try {
      set({ isLoading: true });
      const user = await userService.getUsers();
      if (user) {
        get().setUsers(user);
      }
      set({ isSuccess: true });
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
  toggleUserLock: async (userId) => {
    try {
      set({ isLoading: true });

      await userService.toggleUserLock(userId);
      get().userGetAll();
      set({ isSuccess: true });
      toast.success("User lock status toggled successfully!");
    } catch (error) {
      console.log(error);
    }
  },
}));
