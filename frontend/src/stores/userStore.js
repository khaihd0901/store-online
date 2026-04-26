import { create } from "zustand";
import userService from "@/services/userService";
import { getGuestCart, saveGuestCart, clearGuestCart } from "@/utils/guestCart";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import { getErrorMessage } from "@/utils/errorHandler";

export const useUserStore = create((set, get) => ({
  isLoading: false,
  error: null,
  success: null,
  step: 1,
  email: "",
  wishlist: [],
  carts: [],
  cartCount: 0,
  wishlistCount: 0,
  order: null,
  handleError: (err) => {
    const message = getErrorMessage(err);
    set({ isLoading: false, error: message });
    toast.error(message);
  },
  clearState: () => {
    set({
      step: 1,
      email: "",
      error: null,
      success: null,
      cartCount: 0,
      wishlistCount: 0,
      carts: [],
      wishlist: [],
      order: null,
    });
  },
  userUpdate: async (id, data) => {
    try {
      set({ isLoading: true, error: null });
      const res = await userService.userUpdate(id, data);

      set({
        isLoading: false,
        success: res.message,
      });
      toast.success("Update Information Success");
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
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to get cart",
      });
    }
  },
  userAddToCart: async (product) => {
    try {
      const { user } = useAuthStore.getState();
      if (!user) {
        let guestCart = getGuestCart();

        const existIndex = guestCart.findIndex(
          (i) => i.prodId === product.prodId,
        );

        if (existIndex > -1) {
          guestCart = guestCart.map((item, index) =>
            index === existIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          guestCart = [
            ...guestCart,
            {
              prodId: product.prodId,
              quantity: product.quantity || 1,
              price: product.price,
              prodData: {
                title: product.title,
                author: product.author,
                stock: product.stock || 999,
                images:
                  product.images?.length > 0
                    ? product.images
                    : [{ url: product.image || "/placeholder.png" }],
              },
            },
          ];
        }

        saveGuestCart(guestCart);

        const cartTotal = guestCart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        const cartCount = guestCart.length;

        set({
          carts: {
            items: [...guestCart],
            cartTotal,
          },
          cartCount,
        });
        toast.success("Add to cart success");
        return;
      }

      const res = await userService.userAddToCart({
        prodId: product.prodId,
        quantity: 1,
      });

      const cartCount = res?.items?.length || 0;

      set({
        carts: res,
        cartCount,
      });
      toast.success("Add to cart success");
    } catch (error) {
      toast.error("ADD TO CART ERROR:", error);
      if (error.response?.data?.message) {
        toast.error("Server message:", error.response.data.message);
      }
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
  userMergeCart: async () => {
    const guestCart = getGuestCart();
    console.log("guestCart at store", guestCart);

    if (!guestCart.length) return;

    const res = await userService.userMergeCart(guestCart);

    set({
      carts: res.items,
      cartTotal: res.cartTotal,
    });

    clearGuestCart();
  },
  userApplyCoupon: async (coupon) => {
    try {
      set({ isLoading: true, error: null });

      const res = await userService.userApplyCoupon(coupon);

      set((state) => ({
        isLoading: false,
        success: "Coupon applied",
        carts: {
          ...state.carts,
          totalAfterDiscount: res.totalAfterDiscount,
          appliedCoupon: res.coupon,
          discount: res.discount,
        },
      }));

      toast.success("Coupon applied successfully");
    } catch (err) {
      console.log(err.response)
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to apply coupon",
      });
      get().handleError(err);
    }
  },
  userCreateOrder: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await userService.userCreateOrder(data);
      set({
        isLoading: false,
        success: res.message,
        order: res.order,
        carts: [],
        cartCount: 0,
      });

      toast.success("Order placed successfully 🎉");

      return res; // optional (useful for redirect)
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || "Failed to create order",
      });

      get().handleError(err);
    }
  },
  userRemoveCoupon: async () => {
    try {
      await userService.userRemoveCoupon();

      set((state) => ({
        carts: {
          ...state.carts,
          totalAfterDiscount: null,
          appliedCoupon: null,
          discount: 0,
        },
      }));
    } catch (err) {
      console.log(err);
    }
  },
}));
