import { create } from "zustand";
import productService from "../services/productService";
import { toast } from "sonner";

export const useProductStore = create((set, get) => ({
  products: [],
  imagesData: [],
  product: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  lastQuery: {},
  pagination: {},

  setProducts: (data) => {
    set({
      products: data,
    });
  },

  setProduct: (data) => {
    set({
      product: data,
    });
  },
  clearState: () => {
    set({
      products: [],
      imagesData: [],
      product: null,
      pagination: {},
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  },
  productGetAll: async () => {
    try {
      set({ isLoading: true });
      const data = await productService.getProducts();
      if (data) {
        get().setProducts(data);
      }
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  productSearch: async (query = {}) => {
  try {
    set({ isLoading: true, lastQuery: query });

    const res = await productService.searchProducts(query);

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
      set({ isLoading: true });
      const data = await productService.getProductById(id);
      if (data) {
        get().setProduct(data);
      }
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  productCreate: async (data) => {
    try {
      set({ isLoading: true });
      await productService.createProduct(data);
      set({ isSuccess: true });
      toast.success("Create product Success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  productUpdate: async (id, data) => {
    try {
      set({ isLoading: true, isSuccess: false });
      await productService.updateProduct(id, data);
      set({ isSuccess: true, isLoading: false });
      toast.success("Update product Success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  productDeleteById: async (id) => {
    try {
      set({ isLoading: true });
      await productService.deleteProductById(id);
      toast.success("Delete product Success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
  toggleHotProduct: async (id) => {
  try {
    set({ isLoading: true });
    await productService.toggleHotProduct(id);
    
  } catch (err) {
    console.log(err);
    set({ isError: true });
  } finally {
    set({ isLoading: false });
  }
},

  productUploadImages: async (files) => {
    try {
      set({ isLoading: true });
      const res = await productService.uploadProductImage(files);
      set({ isSuccess: true });
      return res;
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));
