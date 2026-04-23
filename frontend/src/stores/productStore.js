// src/stores/productStore.js
import { create } from "zustand";
import productService from "../services/productService";

export const useProductStore = create((set, get) => ({
  products: [],
  product: null,
  pagination: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  lastQuery: {},

  productSearch: async (query = {}) => {
    try {
      set({ isLoading: true, lastQuery: query });

      const res = await productService.searchProducts(query);
      console.log("hello");
      set({
        products: res.data,
        pagination: res.pagination,
      });
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  productGetById: async (id) => {
    try {
      set({ isLoading: true, isError: false });
      const res = await productService.getProductById(id);
      set({ product: res });
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));
