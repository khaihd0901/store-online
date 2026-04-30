import React from "react";
import { Link } from "react-router";

const SuccessComponent = ({orderData}) => {
  return (
    <div className="h h-fit flex justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-green-600 py-6 flex flex-col items-center text-white">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Order Confirmed</h1>
          <p className="mt-1 text-xs text-slate-200 text-center px-6">
            Your order has been placed successfully.
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Order number */}
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="text-xs text-slate-500">Order number</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {orderData.orderCode}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid gap-3 grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <div className="text-xs text-slate-500">Delivery</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                Apr 30
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
              <div className="text-xs text-slate-500">Total</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {orderData.totalAmount} $
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl bg-slate-50 p-3 border border-slate-200">
            <div className="text-xs text-slate-500">Shipping</div>
            <div className="mt-1 text-sm text-slate-900 leading-snug">
              {orderData.shippingAddress.street} ,{orderData.shippingAddress.ward} ,{orderData.shippingAddress.district}, {orderData.shippingAddress.province}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Link
              to="/orders"
              className="w-full text-center rounded-xl bg-green-600 text-white py-2 text-sm font-medium hover:bg-redd-500 transition"
            >
              View Orders
            </Link>
            <Link
              to="/shop"
              className="w-full text-center rounded-xl bg-red-400 text-white py-2 text-sm font-medium hover:bg-redd-500 transition"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SuccessComponent;