import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import CouponDetail from "./CouponDetail";
import AddCoupon from "./AddCoupon";
import ConfirmModal from "../../components/ConfirmDialog";
import { useCouponStore } from "../../stores/couponStore";

const Coupons = () => {
  const { couponDeleteById, couponGetAll, clearState, coupons } =
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
      description: coupons[i].des,
      value: coupons[i].discountValue,
      minPurchaseAmount: coupons[i].minPurchaseAmount,
      maxUses: coupons[i].maxUses,
      currentUses: coupons[i].currentUses,
      expiryDate: coupons[i].expiryDate,
      isActive: coupons[i].isActive == true ? "Activated" : "Inactive",
      createdAt: coupons[i].createdAt,
      updatedAt: coupons[i].updatedAt,
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
            className="bg-[var(--color-fdaa3d)] text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            + Add Coupon
          </button>
        </div>

        <Table
          data={data}
          onDelete={(e) => handleDeleteClick(e)}
          onView={(e) => handleView(e)}
        />

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
