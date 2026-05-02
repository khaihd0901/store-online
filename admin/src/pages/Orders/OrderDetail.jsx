// pages/orders/OrderDetail.jsx
import { useEffect } from "react";
import { useOrderStore } from "@/stores/orderStore";
import Modal from "../../components/TableModal/Modal";

export default function OrderDetail({ id, onClose }) {

  const { order, isSuccess, clearState, getOrderById, isLoading } =
    useOrderStore();
  console.log(order);
  useEffect(() => {
    getOrderById(id);
  }, [id]);
  useEffect(() => {
    if (isSuccess) {
      clearState();
      onClose(true);
    }
  }, [isSuccess]);
  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  return (
    <Modal onClose={onClose}>
      <div className="p-2 space-y-6 relative">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Order #{order.orderCode}</h1>
        </div>

        {/* USER INFO */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Customer</h2>
          <p>
            <strong>Name:</strong> {order.orderBy?.fullName || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {order.orderBy?.email}
          </p>
        </div>

        {/* SHIPPING */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Shipping Address</h2>
          <p>{order.shippingAddress?.street}</p>
          <p>
            {order.shippingAddress?.ward}, {order.shippingAddress?.district}
          </p>
          <p>{order.shippingAddress?.province}</p>
        </div>

        {/* ITEMS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-3">Items</h2>

          <div className="space-y-3 max-h-30 overflow-y-auto pr-2">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {item.prodId?.title || "Product"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-right">
                  <p>${item.price}</p>
                  <p className="text-sm text-gray-500">
                    Total: ${item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold mb-2">Payment</h2>
          <p>Method: {order.paymentIntent?.method}</p>
          <p>Status: {order.status}</p>
        </div>

        {/* SUMMARY */}
        <div className="bg-white p-4 rounded-xl shadow flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold">${order.totalAmount}</span>
        </div>
      </div>
    </Modal>
  );
}
