import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import CouponDetail from "./CouponDetail";
import AddCoupon from "./AddCoupon";
import ConfirmModal from "../../components/ConfirmDialog";
import { useCouponStore } from "../../stores/couponStore";
import TableSkeleton from "../../components/TableSkeleton";

const Coupons = () => {
  const { couponDeleteById, couponGetAll, clearState, coupons,isLoading } =
    useCouponStore();
  const [couId, setCouId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const addCoupon = () => {
    setShowAdd(false);
  };
  const handleDeleteClick = (e) => {
    setConfirmId(e.id); // open confirm modal
  };

  useEffect(() => {
    couponGetAll();
  }, []);

  const data = [];
  for (let i = 0; i < coupons?.length; i++) {
    data.push({
      key: i + 1,
      id: coupons[i]._id,
      name: coupons[i].code,
      maxUses: coupons[i].maxUses,
      currentUses: coupons[i].currentUses,
      expiryDate: new Date(coupons[i].expiryDate).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      isActive: coupons[i].isActive == true ? <div className="text-green-500">Activated</div> : <div className="text-red-500">Inactive</div>,
      createdAt: new Date(coupons[i].createdAt).toLocaleDateString(),
      updatedAt: new Date(coupons[i].updatedAt).toLocaleDateString(),
    });
  }
  const handleView = (e) => {
    clearState();
    setCouId(e.id);
  };
  const handleCloseAddCoupon = (reload = true) => {
    setShowAdd(false);
    setCouId(null);
    if (reload) {
      couponGetAll();
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-semibold">Coupon Management</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[var(--color-febd69)] text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            + Add Coupon
          </button>
        </div>

        {isLoading ? (
          <TableSkeleton rows={coupons.length} cols={data.length} />
        ) : (
          <Table
            data={data}
            onDelete={(e) => handleDeleteClick(e)}
            onView={(e) => handleView(e)}
          />
        )}

        {showAdd && (
          <AddCoupon onClose={handleCloseAddCoupon} onAdd={addCoupon} />
        )}

        {couId && <CouponDetail couId={couId} onClose={handleCloseAddCoupon} />}
      </div>

      {confirmId && (
        <ConfirmModal
          open={true}
          title="Delete product?"
          message="This action cannot be undone."
          confirmText="Delete"
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            couponDeleteById(confirmId)
              .then(() => {
                couponGetAll();
                setConfirmId(null);
              })
              .catch(() => {
                setConfirmId(null);
              });
          }}
        />
      )}
    </>
  );
};

export default Coupons;
