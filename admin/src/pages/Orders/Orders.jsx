import React, { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import DetailModal from "../../components/TableModal/DetailModal";
import TableSkeleton from "../../components/TableSkeleton.jsx";
import { useOrderStore } from "../../stores/orderStore.js";
import ConfirmModal from "../../components/ConfirmDialog.jsx";

const ORDER_STATUS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  { value: "processing", label: "Processing", color: "bg-blue-100 text-blue-700" },
  { value: "shipped", label: "Shipped", color: "bg-purple-100 text-purple-700" },
  { value: "delivered", label: "Delivered", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];
const Orders = () => {
  const {
    orderGetAll,
    orders,
    clearState,
    isLoading,
  } = useOrderStore();
const [openStatusId, setOpenStatusId] = useState(null);
const [pendingStatus, setPendingStatus] = useState(null);
const [confirmOpen, setConfirmOpen] = useState(false);
console.log(orders)
  const [userId, setUserId] = useState(null);

  // ======================
  // FETCH ORDERS
  // ======================
  useEffect(() => {
    orderGetAll();
  }, []);

  // ======================
  // VIEW ORDER
  // ======================
  const handleView = (e) => {
    clearState();
    setUserId(e.id);
  };

  const handleCloseDetail = async (reload = false) => {
    clearState();
    setUserId(null);
    if (reload) await orderGetAll();
  };

  // ======================
  // STATUS COMPONENT
  // ======================
const StatusDropdown = ({ order }) => {
  const { updateOrderStatus } = useOrderStore();

  const current = ORDER_STATUS.find((s) => s.value === order.status);

  const isOpen = openStatusId === order._id;

  // const handleChange = async (status) => {
  //   setOpenStatusId(null);
  //   await updateOrderStatus(order._id, status);
  //   order.status = status; // optimistic UI
  // };
useEffect(() => {
  const handler = (e) => {
    if (!e.target.closest(".relative")) setOpenStatusId(null);
  };

  document.addEventListener("click", handler);
  return () => document.removeEventListener("click", handler);
}, []);
  // STEP 1: user clicks new status
  const handleSelect = (status) => {
    setPendingStatus({
      orderId: order._id,
      newStatus: status,
    });

    setConfirmOpen(true);
    setOpenStatusId(null);
  };

  // STEP 2: confirm action
  const handleConfirm = async () => {
    if (!pendingStatus) return;

    await updateOrderStatus(
      pendingStatus.orderId,
      pendingStatus.newStatus
    );

    setPendingStatus(null);
    setConfirmOpen(false);
  };
  return (
    <>
    <div className="relative inline-block">
      {/* BUTTON */}
      <button
        onClick={() =>
          setOpenStatusId(isOpen ? null : order._id)
        }
        className={`px-3 py-1 rounded-full text-xs font-semibold ${current?.color}`}
      >
        {current?.label || order.status}
      </button>

      {/* DROPDOWN */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg">
          {ORDER_STATUS.map((s) => (
            <button
              key={s.value}
              onClick={() => handleSelect(s.value)}
              className="w-full flex justify-between px-3 py-2 text-sm rounded-xl hover:bg-gray-100"
            >
              <span>{s.label}</span>
              {order.status === s.value && (
                <span className="text-green-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
          <ConfirmModal
        open={confirmOpen}
        title="Change Order Status?"
        message={`Are you sure you want to change status to "${pendingStatus?.newStatus}"?`}
        confirmText="Yes, change"
        cancelText="Cancel"
        onCancel={() => {
          setConfirmOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={handleConfirm}
      />
      </>
  );
};

  // ======================
  // FORMAT TABLE DATA
  // ======================
  const data =
    orders.data?.map((item, index) => ({
      key: index + 1,
      id: item._id,

      orderCode: item.orderCode,
      orderBy: item.orderBy?.fullName || "N/A",

      totalAmount: <span>{item.totalAmount} $</span>,

      createdAt: new Date(item.createdAt).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),

      orderStatus: <StatusDropdown order={item} />,
    })) || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Order Management</h1>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <Table data={data} onView={handleView} />
      )}

      {/* DETAIL MODAL */}
      {userId && (
        <DetailModal data={userId} onClose={handleCloseDetail} />
      )}
    </div>
  );
};

export default Orders;