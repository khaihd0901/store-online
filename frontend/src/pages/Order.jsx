import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { orders, userGetOrders, isLoading } = useUserStore();

  useEffect(() => {
    userGetOrders();
  }, [userGetOrders]);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "processing":
        return "bg-blue-100 text-blue-600";
      case "shipped":
        return "bg-purple-100 text-purple-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <div className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">My Orders</h2>

        {/* Table Header */}
        <div className="grid grid-cols-5 font-medium text-gray-500 border-b pb-3">
          <span>Order ID</span>
          <span>Date</span>
          <span>Total</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-8 text-center text-gray-500">Loading orders...</div>
        )}

        {/* Empty State */}
        {!isLoading && (!orders || orders.length === 0) && (
          <div className="py-8 text-center text-gray-500">You have no orders yet.</div>
        )}

        {/* Orders */}
        {!isLoading && orders && orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-5 items-center py-4 border-b"
          >
            <span className="font-medium">{order.orderCode}</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
            <span>{formatPrice(order.totalAmount)}</span>
            <span>
              <span
                className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </span>
            <button
              onClick={() => setSelectedOrder(order)}
              className="text-black font-medium hover:underline"
            >
              View
            </button>
          </div>
        ))}

        {/* Pagination (Optional/Mock for now) */}
        {!isLoading && orders && orders.length > 0 && (
          <div className="flex justify-end mt-6 space-x-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50">
              Prev
            </button>
            <button className="px-3 py-1 bg-black text-white rounded-lg">
              1
            </button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Order {selectedOrder.orderCode}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs capitalize ${getStatusStyle(
                  selectedOrder.status
                )}`}
              >
                {selectedOrder.status}
              </span>
            </div>

            <div className="mb-4 text-sm space-y-1">
              <p className="text-gray-500">
                Date: <span className="text-black">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
              </p>
              <p className="text-gray-500">
                Total Amount: <span className="text-black font-medium">{formatPrice(selectedOrder.totalAmount)}</span>
              </p>
            </div>

            <div className="space-y-3 border-t pt-4">
              <h4 className="font-medium text-sm text-gray-700">Order Items:</h4>
              {selectedOrder.items?.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{item.prodId?.title || "Unknown Product"}</p>
                    <p className="text-xs text-gray-500">
                      {item.prodId?.author || ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{formatPrice(item.price)}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedOrder.shippingAddress && (
              <div className="mt-4 border-t pt-4 text-sm">
                <h4 className="font-medium text-gray-700 mb-1">Shipping Address:</h4>
                <p className="text-gray-600">{selectedOrder.shippingAddress.fullName} - {selectedOrder.shippingAddress.phone}</p>
                <p className="text-gray-600">
                  {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.wardName}, {selectedOrder.shippingAddress.districtName}, {selectedOrder.shippingAddress.provinceName}
                </p>
              </div>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-6 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}