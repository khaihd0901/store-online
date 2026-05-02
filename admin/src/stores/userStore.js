import { create } from "zustand";
import { toast } from "sonner";
import userService from "../services/userService";

export const useUserStore = create((set, get) => ({
  users: [],
  deletedUsers: [],
  user: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  results: [],

  setUsers: (data) => {
    set({
      users: data,
    });
  },
   setDeletedUsers: (data) => {
    set({
      deletedUsers: data,
    });
  },
  setUser: (data) => {
    set({
      user: data,
    });
  },
  clearState: () => {
    set({
      users: [],
      user: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
  results: [],

    });
  },
  userGetAll: async () => {
    try {
      set({ isLoading: true });
      const user = await userService.getUsers();
      if (user) {
        get().setUsers(user);
      }
      console.log(user);
      set({ isSuccess: true });
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
  
  userGetDeleted: async () => {
    try {
      set({ isLoading: true });
      const users = await userService.getDeletedUsers();
      if (users) {
        get().setDeletedUsers(users);
      }
    } catch (error) {
      console.log(error);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
  userGetById: async (userId) => {
    try {
      set({ isLoading: true });
      const user = await userService.getUserById(userId);
      if (user) {
        get().setUser(user);
      }
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
  userUpdate: async (userId, data) => {
    try {
      set({ isLoading: true });
      await userService.updateUser(userId, data);
      get().userGetById(userId);
      set({ isSuccess: true });
      toast.success("User updated successfully!");
    } catch (error) {
      console.log(error);
      set({ isError: true });
      toast.error("Failed to update user");
    } finally {
      set({ isLoading: false });
    }
  },
  userDelete: async (userId) => {
    try {
      set({ isLoading: true });
      await userService.deleteUser(userId);
      get().userGetDeleted();
      set({ isSuccess: true });
      toast.success("User deleted successfully!");
    } catch (error) {
      console.log(error);
      set({ isError: true });
      toast.error("Failed to delete user");
    } finally {
      set({ isLoading: false });
    }
  },
  userRestore: async (userId) => {
    try {
      set({ isLoading: true });
      await userService.restoreUser(userId);
      get().userGetAll();
      set({ isSuccess: true });
      toast.success("User restored successfully!");
    } catch (error) {
      console.log(error);
      set({ isError: true });
      toast.error("Failed to restore user");
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
  userSearchGlobal :async (type, keyword) => {
    if (!keyword) return set({ results: [] });

    set({ loading: true });

    try {
      const data = await userService.searchAdmin(type, keyword);
      set({ results: data });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
