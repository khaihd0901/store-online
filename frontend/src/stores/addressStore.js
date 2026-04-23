import addressService from "@/services/addressService";
import { create } from "zustand";
import { toast } from "sonner";

export const useAddressStore = create((set, get) => ({
  addresses: [],
  selectedAddress: null,

  isLoading: false,
  isSuccess: false,
  isError: false,

  // =========================
  // HELPERS
  // =========================
  syncSelectedAddress: (list) => {
    const defaultAddr = list.find(a => a.isDefault);
    set({
      selectedAddress: defaultAddr || list[0] || null,
    });
  },

  // =========================
  // SETTERS
  // =========================
  setAddresses: (data) => {
    set({ addresses: data });
    get().syncSelectedAddress(data);
  },

  setSelectedAddress: (id) => {
    const addr = get().addresses.find(a => a._id === id);
    if (!addr) return;
    set({ selectedAddress: addr });
  },

  clearState: () => {
    set({
      addresses: [],
      selectedAddress: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  },

  // =========================
  // GET ALL
  // =========================
  addressGetAll: async () => {
    try {
      set({ isLoading: true });

      const data = await addressService.userGetAddress();

      if (data) {
        set({ addresses: data });
        get().syncSelectedAddress(data);
      }

    } catch (err) {
      console.log(err);
      toast.error("Failed to load addresses");
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  // =========================
  // ADD
  // =========================
  addAddress: async (payload) => {
    try {
      set({ isLoading: true });

      const data = await addressService.userAddAddress(payload);

      set({ addresses: data });
      get().syncSelectedAddress(data);

      toast.success("Address added");

    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Add address failed");
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  // =========================
  // DELETE
  // =========================
  deleteAddress: async (id) => {
    try {
      set({ isLoading: true });

      const data = await addressService.userDeleteAddress(id);

      set({ addresses: data });
      get().syncSelectedAddress(data);

      toast.success("Address removed");

    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Delete failed");
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  // =========================
  // SET DEFAULT
  // =========================
  setDefaultAddress: async (id) => {
    try {
      set({ isLoading: true });

      const data = await addressService.userSetDefaultAddress(id);

      set({ addresses: data });
      get().syncSelectedAddress(data);

      toast.success("Default address updated");

    } catch (err) {
      console.log(err);
      toast.error("Failed to update default");
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

}));