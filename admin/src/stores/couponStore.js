import { create } from "zustand";
import couponService from "../services/couponService";
import { toast } from "sonner";

export const useCouponStore = create((set, get) => ({
  coupons: [],
  coupon: null,
  isLoading: false,
  isSuccess: false,
  isError: false,

  setCoupons: (data) => {
    set({
      coupons: data,
    });
  },
  setCoupon: (data) => {
    set({
      coupon: data,
    });
  },
  clearState: () => {
    set({
      coupons: [],
      coupon: null,
      isLoading: false,
      isSuccess: false,
      isError: false,
    });
  },
  couponGetAll: async () => {
    try {
      set({ isLoading: true });
      const data = await couponService.getCoupons();
      if (data) {
        get().setCoupons(data);
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
  couponGetById: async (id) => {
    try {
      set({ isLoading: true });
      const data = await couponService.getCouponById(id);
      if (data) {
        get().setCoupon(data);
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
  couponCreate: async (data) => {
    try {
      set({ isLoading: true });
      await couponService.createCoupon(data);
      set({ isSuccess: true });
      toast.success("Create coupon success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  couponUpdate: async (id, data) => {
    try {
      set({ isLoading: true });
      await couponService.updateCoupon(id, data);
      set({ isSuccess: true });
      toast.success("Update coupon success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({
        isLoading: false,
      });
    }
  },
  couponDeleteById: async (id) => {
    try {
      set({ isLoading: true });
      await couponService.deleteCoupon(id);
      set({ isSuccess: true });
      toast.success("Delete coupon success");
    } catch (err) {
      console.log(err);
      set({ isError: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));
