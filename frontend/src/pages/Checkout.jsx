import React, { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { Truck, Store, ShieldCheck, TicketPercent } from "lucide-react";

const Checkout = () => {
  const { carts } = useUserStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = carts.items?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = 5;
  const discount = 10;
  const total = subtotal + shipping - discount;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ form, carts });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10 px-4">

        {/* LEFT */}
        <div className="col-span-2">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <input
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <input
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
            />

            <div className="grid grid-cols-3 gap-3">
              <input name="city" placeholder="City" className="border p-3 rounded-lg" onChange={handleChange} />
              <input name="state" placeholder="State" className="border p-3 rounded-lg" onChange={handleChange} />
              <input name="zip" placeholder="ZIP" className="border p-3 rounded-lg" onChange={handleChange} />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <input type="checkbox" />
              I agree to Terms & Conditions
            </div>
          </form>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">Review your cart</h2>

          <div className="space-y-4">
            {carts.items?.map((item) => (
              <div key={item._id} className="flex gap-4">
                <img
                  src={item.prodId.images?.[0]?.url}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.prodId.title}</p>
                  <p className="text-xs text-gray-500">{item.quantity}x</p>
                </div>
                <p className="text-sm font-semibold">${item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* Discount */}
          <div className="relative mt-6">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {/* Ticket icon */}
              <TicketPercent className="text-gray-700 font-bold"/>
            </span>

            <input
              placeholder="Discount code"
              className="w-full border p-3 pl-10 pr-24 rounded-lg"
            />

            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm hover:bg-indigo-700"
            >
              Apply
            </button>
          </div>

          {/* TOTAL */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Discount</span>
              <span>-${discount}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-red-400 text-white py-3 rounded-xl font-medium hover:bg-red-500">
            Pay Now
          </button>

          <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
            <ShieldCheck size={16} /> Secure Checkout - SSL Encrypted
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;