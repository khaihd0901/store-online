import React, { useCallback, useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import DetailModal from "../../components/TableModal/DetailModal";
import TableSkeleton from "../../components/TableSkeleton.jsx";
import { useOrderStore } from "../../stores/orderStore.js";
import ConfirmModal from "../../components/ConfirmDialog.jsx";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import OrderDetail from "./OrderDetail.jsx";

const ORDER_STATUS = [
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "processing",
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "shipped",
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "delivered",
    label: "Delivered",
    color: "bg-green-100 text-green-700",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];
const Orders = () => {
  const { orderGetAll, pagination, clearState, isLoading } = useOrderStore();
  const [openStatusId, setOpenStatusId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const data = useOrderStore((s) => s.orders);

  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sort, setSort] = useState("desc");
  const [filters, setFilters] = useState({});
  const debouncedSearch = useDebounce(search, 500);
  // ======================
  // STATUS COMPONENT
  // ======================
  const StatusDropdown = ({ order }) => {
    const { updateOrderStatus } = useOrderStore();

    const current = ORDER_STATUS.find((s) => s.value === order.status);

    const isOpen = openStatusId === order._id;
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

      await updateOrderStatus(pendingStatus.orderId, pendingStatus.newStatus);

      setPendingStatus(null);
      setConfirmOpen(false);
    };
    return (
      <>
        <div className="relative inline-block">
          {/* BUTTON */}
          <button
            onClick={() => setOpenStatusId(isOpen ? null : order._id)}
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
  // FETCH ORDERS
  // ======================
  const fetchOrders = useCallback(async () => {
    const params = {
      page,
      limit,
      sort: `${sort === "asc" ? "" : "-"}${sortKey}`,
      ...filters,
    };

    // if (search) params.search = search;

    await orderGetAll(params);
  }, [page, limit, sortKey, sort, filters, orderGetAll]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getPageNumbers = () => {
    const total = pagination?.totalPages || 1;
    const visible = 3;

    let start = Math.max(1, page - Math.floor(visible / 2));
    let end = Math.min(total, start + visible - 1);

    if (end - start + 1 < visible) {
      start = Math.max(1, end - visible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const orders =
    data?.map((item, index) => ({
      key: index + 1,
      id: item._id,

      orderCode: item.orderCode,
      orderBy: item.orderBy?.email || "N/A",

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
  const handleFilter = (key, value) => {
    setPage(1);
    setFilters((prev) => {
      const newFilters = { ...prev };

      if (value === undefined) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }

      return newFilters;
    });
  };
  useEffect(() => {
    handleFilter("search", debouncedSearch);
  }, [debouncedSearch]);
  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
      <div className=" flex items-center justify-between mb-6">
        <div className="">
          <h1 className="text-xl font-semibold">Order Management</h1>
        </div>
        <div className="relative search-box w-xl">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value); // only update local state
            }}
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl focus:ring-2 outline-0 focus:ring-orange-400"
          />
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <TableSkeleton rows={data.length} cols={7} />
      ) : (
        <Table data={orders} onView={handleView} />
      )}
      {/* pagination */}
      <div className="flex justify-center pt-8">
        <nav className="flex items-center space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className={`px-3 py-2 text-sm font-semibold ${
              page === 1
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Prev
          </button>
          {getPageNumbers().map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold ${
                page === pageNumber
                  ? "bg-red-400 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            disabled={page === pagination?.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className={`px-3 py-2 text-sm font-semibold ${
              page === pagination?.totalPages
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Next
          </button>
        </nav>
      </div>
      {/* DETAIL MODAL */}
      {userId && <OrderDetail id={userId} onClose={handleCloseDetail} />}
    </div>
  );
};

export default Orders;
