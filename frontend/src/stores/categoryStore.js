import { create } from "zustand";
import categoryService from "../services/categoryService";
import { toast } from "sonner";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  category: null,
  books: [],
  pagination: {},
  isLoading: false,
  isSuccess: false,
  isError: false,

  setCategories: (data) => {
    set({
      categories: data,
    });
  },

  setCategory: (data) => {
    set({
      category: data,
    });
  },

  clearState: () => {
    set({
      categories: [],
  books: [],
      pagination: {},
      category: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  },

  categoryGetAll: async () => {
    try {
      set({ isLoading: true });
      const data = await categoryService.getCategories();
      if (data) {
        get().setCategories(data);
      }
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

  categoryGetById: async (id,page=1) => {
    try {
      set({ isLoading: true });
      const data = await categoryService.getCategoryById(id,page);
      if (data) {
        get().setCategory(data);
      }
        set({
      books: data.books,
      pagination: data.pagination,
      });
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },

}));
