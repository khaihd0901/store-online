import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getGuestCart } from "@/utils/guestCart";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";
import StepBar from "@/components/StepBar";
import Checkout from "./Checkout";

export default function Cart() {
  const {
    carts,
    userRemoveItemFromCart,
    userUpdateQuantity,
    userRemoveCoupon,
  } = useUserStore();
  const { user, openLogin } = useAuthStore();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [step, setStep] = useState(1);
  const [displayCart, setDisplayCart] = useState({
    items: [],
    cartTotal: 0,
  });
  const normalizeGuestCart = (guestCart) => ({
    items: guestCart.map((item) => ({
      quantity: item.quantity,
      prodId: {
        _id: item.prodId,
        title: item.prodData.title,
        price: item.price,
        author: item.prodData.author || "Unknown",

        images:
          item.prodData.images && item.prodData.images.length > 0
            ? item.prodData.images
            : [{ url: "/placeholder.png" }],
      },
    })),
    cartTotal: guestCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ),
  });

  useEffect(() => {
    if (user) {
      if (carts && carts.items) {
        setDisplayCart(carts);
      }
    } else {
      const guestCart = getGuestCart();
      setDisplayCart(normalizeGuestCart(guestCart));
    }
  }, [user, carts]);

  const handleRemove = async () => {
    if (!selectedId) return;

    if (!user) {
      const updated = getGuestCart().filter(
        (item) => item.prodId !== selectedId, // ✅ FIX
      );

      localStorage.setItem("guest_cart", JSON.stringify(updated));
      setDisplayCart(normalizeGuestCart(updated));
    } else {
      await userRemoveItemFromCart(selectedId);
    }

    setShowConfirm(false);
    setSelectedId(null);
  };

  const updateQuantity = async (id, newQty) => {
    if (!user) {
      let guestCart = getGuestCart();

      guestCart = guestCart.map((item) =>
        item.prodId === id ? { ...item, quantity: newQty } : item,
      );

      localStorage.setItem("guest_cart", JSON.stringify(guestCart));
      setDisplayCart(normalizeGuestCart(guestCart));
      return;
    }

    await userUpdateQuantity(id, newQty);
  };

  // 🔥 CHECKOUT
  const handleCheckout = () => {
    if (!user) {
      toast.error("Please login to checkout");
      openLogin();
      return;
    }

    setStep(2); // 👉 go to checkout step
  };
  const handleChangeStep = async (nextStep) => {
    if (step === 2 && nextStep === 1 && carts?.appliedCoupon) {
      await userRemoveCoupon();
    }

    setStep(nextStep);
  };
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4">
        <StepBar currentStep={step} onStepChange={handleChangeStep} />
        {step === 1 && (
          <>
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
              {/* CART ITEMS */}
              <div className="md:col-span-2 space-y-4">
                {displayCart.items?.length === 0 && (
                  <div className="bg-white rounded-2xl shadow p-10 text-center">
                    <p className="text-gray-500 mb-4">Your cart is empty.</p>
                    <Link
                      to="/shop"
                      className="bg-black text-white px-6 py-2 rounded-lg"
                    >
                      Browse Books
                    </Link>
                  </div>
                )}

                {displayCart.items?.map((item) => (
                  <div
                    key={item.prodId._id}
                    className="bg-white rounded-2xl shadow p-4 flex gap-4"
                  >
                    <img
                      src={item.prodId?.images?.[0]?.url || "/placeholder.png"}
                      alt={item.prodId.title}
                      className="w-24 h-32 object-cover rounded-lg"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.prodId.title}</h3>
                      <p className="text-sm text-gray-500">
                        {item.prodId.author}
                      </p>

                      <p className="mt-2 font-medium">${item.prodId.price}</p>

                      {/* QUANTITY */}
                      <div className="flex items-center mt-3 gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              setSelectedId(item.prodId._id);
                              setShowConfirm(true);
                            } else {
                              updateQuantity(
                                item.prodId._id,
                                item.quantity - 1,
                              );
                            }
                          }}
                          className="px-2 py-1 border rounded"
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            updateQuantity(item.prodId._id, item.quantity + 1)
                          }
                          className="px-2 py-1 border rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => {
                        setSelectedId(item.prodId._id);
                        setShowConfirm(true);
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* SUMMARY */}
              <div className="bg-white rounded-2xl shadow p-6 h-fit">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${displayCart.cartTotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>$5.00</span>
                  </div>

                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>${displayCart.cartTotal + 5}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>

            {/* CONFIRM MODAL */}
            {showConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-80 shadow-lg">
                  <h3 className="text-lg font-semibold mb-3">Remove item?</h3>
                  <p className="text-sm text-gray-500 mb-5">
                    Are you sure you want to remove this item?
                  </p>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 rounded-lg border"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRemove}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {step === 2 && <Checkout />}

        {step === 3 && <SuccessComponent />}
      </div>
    </div>
  );
}
