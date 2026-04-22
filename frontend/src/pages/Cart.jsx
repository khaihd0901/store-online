import { useUserStore } from "@/stores/userStore";
import { Link } from "react-router";

export default function Cart() {
  const { carts, userRemoveItemFromCart, userUpdateQuantity } = useUserStore();
  const handleRemoveItem = async (id) => {
    await userRemoveItemFromCart(id);
  };
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Shopping Cart</h2>

          {carts?.items?.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty.</p>
              <Link
                to={"/shop"}
                className="bg-black text-white px-6 py-2 rounded-lg"
              >
                Browse Books
              </Link>
            </div>
          )}

          {carts?.items?.map((item) => (
            <div
              key={item.prodId._id}
              className="bg-white rounded-2xl shadow p-4 flex gap-4"
            >
              <img
                src={item.prodId.image}
                alt={item.prodId.title}
                className="w-24 h-32 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.prodId.title}</h3>
                <p className="text-sm text-gray-500">{item.prodId.author}</p>

                <p className="mt-2 font-medium">${item.prodId.price}</p>

                {/* Quantity */}
                <div className="flex items-center mt-3 gap-2">
                  {/* DECREASE */}
                  <button
                    onClick={() => {
                      if (item.quantity === 1) {
                        userRemoveItemFromCart(item.prodId._id);
                      } else {
                        userUpdateQuantity(item.prodId._id, item.quantity - 1);
                      }
                    }}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  {/* INCREASE */}
                  <button
                    onClick={() => {
                      if (item.quantity >= item.prodId.stock) return;
                      userUpdateQuantity(item.prodId._id, item.quantity + 1);
                    }}
                    disabled={item.quantity >= item.prodId.stock}
                    className="px-2 py-1 border rounded disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                {/* STOCK WARNING */}
                {item.quantity >= item.prodId.stock && (
                  <p className="text-xs text-red-500 mt-1">
                    Only {item.prodId.stock} left in stock
                  </p>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => handleRemoveItem(item.prodId._id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${carts?.cartTotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>${carts?.cartTotal + 5}</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:bg-gray-800">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
