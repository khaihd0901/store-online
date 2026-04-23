import { create } from "zustand";
import userService from "@/services/userService";
import { toast } from "sonner";

export const useUserStore = create((set,get) => ({
  user: null,
  isLoading: false,
  error: null,
  success: null,
  step: 1,
  email: "",
  wishlist: [],
  carts : [],
  cartCount: 0,
  wishlistCount: 0,

  clearState: () => {
    set({
      step: 1,
      email: "",
      error: null,
      success: null,
      cartCount: 0,
      wishlistCount: 0,
      cart: [],
      wishlist: [],
    });
  },
  userUpdate: async (id,data) => {
    try {
      set({ isLoading: true, error: null });
      const res = await userService.userUpdate(id,data);

      set({
        isLoading: false,
        success: res.message,
      });
toast.success("Update Information Success")
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to send OTP",
      });
    }
  },
  userForgotPasswordOTP: async (emailData) => {
    try {
      set({ isLoading: true, error: null });
      const res = await userService.userForgotPasswordOTP(emailData);
      set({
        isLoading: false,
        success: res.message,
        email: emailData.email,
        step: 2,
      });

    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to send OTP",
      });
    }
  },
  userVerifyOTP: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await userService.userVerifyOTP(data);

      set({
        isLoading: false,
        success: res.message,
        step: 3,
      });

    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Invalid OTP",
      });
    }
  },
  userResetPassword: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await userService.userResetPassword(data);

      set({
        isLoading: false,
        success: res.message,
        step: 1,
        email: "",
      });

    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Reset failed",
      });
    }
  },
  userGetWishlist: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await userService.userGetWishlist();
      set({
        isLoading: false,
        wishlist: res,
        wishlistCount: res.length,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to get wishlist",
      });
    }
  },
userAddToWishlist: async (productId) => {
  try {
    set({ isLoading: true, error: null });

    const res = await userService.userAddToWishlist(productId);
    set((state) => ({
      wishlistCount: state.wishlistCount + 1,
      isLoading: false,
      success: res.message,
    }));
    get().userGetWishlist();

  } catch (err) {
    set({
      isLoading: false,
      error: err.response?.data?.message || "Failed to add to wishlist",
    });
  }
},
  userRemoveFromWishlist: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await userService.userRemoveFromWishlist(productId);
      set({
        isLoading: false,
        success: res.message,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to remove from wishlist",
      });
    }
  },
userGetCart: async () => {
  try {
    set({ isLoading: true, error: null });

    const res = await userService.userGetCart();
    
    set({
      isLoading: false,
      carts: res,
      cartCount: res.items.length, 
    });

  } catch (err) {
    toast.error("Something went wrong !!!");

    set({
      isLoading: false,
      error: err.response?.data?.message || "Failed to get cart",
    });
  }
},
userAddToCart: async (cartData) => {
  try {
    set({ isLoading: true, error: null });
    const res = await userService.userAddToCart(cartData);
    get().userGetCart();
    set({
      isLoading: false,
      success: res.message,
      cartCount: res.items.length,
    });
    toast.success("Add to cart success");
  } catch (err) {
    console.log(err)
    toast.error("Something went wrong !!!");

    set({
      isLoading: false,
      error: err.response?.data?.message || "Failed to add to cart",
    });
  }
},
userRemoveItemFromCart: async (prodId) => {
  try {
    set({ isLoading: true, error: null });
    await userService.userRemoveItemFromCart(prodId);
    toast.success("Remove item success");
    await get().userGetCart();

    set({ isLoading: false });

  } catch (err) {
    set({
      isLoading: false,
      error: err.response?.data?.message || "Failed to remove item",
    });

    toast.error(err.response?.data?.message || "Error");
  }
},
userUpdateQuantity: async (prodId, quantity) => {
  try {
    set({ isLoading: true, error: null });
    await userService.userUpdateQuantity({ prodId, quantity });
    await get().userGetCart();
    set({ isLoading: false });
  } catch (err) {
    set({
      isLoading: false,
      error: err.response?.data?.message || "Update failed",
    });
  }
},
}));