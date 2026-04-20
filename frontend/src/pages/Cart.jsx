import { useState } from "react";

const cartMock = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    price: 18,
    quantity: 1,
    image: "https://m.media-amazon.com/images/I/81F90H7hnML.jpg",
  },
  {
    id: 2,
    title: "Deep Work",
    author: "Cal Newport",
    price: 15,
    quantity: 2,
    image: "https://m.media-amazon.com/images/I/71g2ednj0JL.jpg",
  },
];

export default function Cart() {
  const [cart, setCart] = useState(cartMock);

  const updateQuantity = (id, amount) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">

          <h2 className="text-2xl font-semibold mb-4">
            Shopping Cart
          </h2>

          {cart.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-10 text-center">
              <p className="text-gray-500 mb-4">
                Your cart is empty.
              </p>
              <button className="bg-black text-white px-6 py-2 rounded-lg">
                Browse Books
              </button>
            </div>
          )}

          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow p-4 flex gap-4"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-32 object-cover rounded-lg"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.author}
                </p>

                <p className="mt-2 font-medium">
                  ${item.price}
                </p>

                {/* Quantity */}
                <div className="flex items-center mt-3 gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2 py-1 border rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow p-6 h-fit">
          <h3 className="text-lg font-semibold mb-4">
            Order Summary
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>

            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>${(subtotal + 5).toFixed(2)}</span>
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