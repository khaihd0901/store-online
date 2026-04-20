import { useState } from "react";

const ordersMock = [
  {
    id: "#1001",
    date: "2026-04-15",
    total: "$45.00",
    status: "Delivered",
    items: [
      { title: "Atomic Habits", author: "James Clear" },
      { title: "Deep Work", author: "Cal Newport" },
    ],
  },
  {
    id: "#1002",
    date: "2026-04-18",
    total: "$20.00",
    status: "Pending",
    items: [{ title: "The Alchemist", author: "Paulo Coelho" }],
  },
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-gray-50 py-10">
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

        {/* Orders */}
        {ordersMock.map((order) => (
          <div
            key={order.id}
            className="grid grid-cols-5 items-center py-4 border-b"
          >
            <span>{order.id}</span>
            <span>{order.date}</span>
            <span>{order.total}</span>
            <span>
              <span
                className={`px-3 py-1 rounded-full text-xs ${getStatusStyle(
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

        {/* Pagination */}
        <div className="flex justify-end mt-6 space-x-2">
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            Prev
          </button>
          <button className="px-3 py-1 bg-black text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            2
          </button>
          <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              Order {selectedOrder.id}
            </h3>

            <p className="text-sm text-gray-500 mb-2">
              Date: {selectedOrder.date}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Total: {selectedOrder.total}
            </p>

            <div className="space-y-2">
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="border-b pb-2">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">
                    {item.author}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 w-full bg-black text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}