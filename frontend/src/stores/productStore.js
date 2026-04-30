// src/stores/productStore.js
import { create } from "zustand";
import productService from "../services/productService";

export const useProductStore = create((set) => ({
  products: [],
  bestSellingProducts: [],
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
      console.log("Dữ liệu gốc từ productSearch:", res);

      // Trích xuất mảng an toàn cho trang Shop
      const productsArray = res?.data?.data || res?.data || res?.products || (Array.isArray(res) ? res : []);

      set({
        products: productsArray,
        pagination: res?.pagination || res?.data?.pagination || {},
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
      
      // Lấy chi tiết 1 sản phẩm
      const productDetail = res?.data?.data || res?.data || res;
      set({ product: productDetail });
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  productGetBestSelling: async () => {
    try {
      set({ isLoading: true, isError: false });
      const res = await productService.getBestSellingProducts();
      console.log("Dữ liệu gốc từ productGetBestSelling:", res);

      // Trích xuất mảng an toàn cho Slider bán chạy
      const bestSellingArray = res?.data?.data || res?.data || res?.products || (Array.isArray(res) ? res : []);

      set({ bestSellingProducts: bestSellingArray });
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));