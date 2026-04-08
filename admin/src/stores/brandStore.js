import { create } from "zustand";
import brandService from "../services/brandService";
import { toast } from "sonner";

export const useBrandStore = create((set, get) => ({
  brands: [],
  brand: null,
  isLoading: false,
  isSuccess: false,
  isError: false,

  setBrands: (data) => {
    set({
      brands: data,
    });
  },

  setBrand: (data) => {
    set({
      brand: data,
    });
  },

  clearState: () => {
    set({
      brands: [],
      brand: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  },

  brandGetAll: async () => {
    try {
      set({ isLoading: true });
      const data = await brandService.getBrands();
      if (data) {
        get().setBrands(data);
      }
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  brandGetById: async (id) => {
    try {
      set({ isLoading: true });
      const data = await brandService.getBrandById(id);
      if (data) {
        get().setBrand(data);
      }
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  brandCreate: async (data) => {
    try {
      set({ isLoading: true });
      await brandService.createBrand(data);
      set({ isSuccess: true });
      toast.success("Create brand success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  brandUpdate: async (id, data) => {
    try {
      set({ isLoading: true });
      await brandService.updateBrand(id, data);
      set({ isSuccess: true });
      toast.success("Update brand success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
  brandDeleteById: async (id) => {
    try {
      set({ isLoading: true });
      await brandService.deleteBrand(id);
      set({ isSuccess: true });
      toast.success("Delete brand success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));
