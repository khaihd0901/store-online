import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import BrandDetail from "./BrandDetail";
import AddBrand from "./AddBrand";
import ConfirmModal from "../../components/ConfirmDialog";
import { useBrandStore } from "../../stores/brandStore";

const Brands = () => {
  const {brandDeleteById, brandGetAll, clearState, brands } = useBrandStore();
  const [brandId, setBrandId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const addBrand = () => {
    setShowAdd(false);
  };
  const handleDeleteClick = (e) => {
    setConfirmId(e.id); // open confirm modal
  };

  useEffect(() => {
    brandGetAll();
  }, []);

  const data = [];
  for (let i = 0; i < brands?.length; i++) {
    data.push({
      key: i + 1,
      id: brands[i]._id,
      name: brands[i].name,
      products: brands[i].products.length
    });
  }
  const handleView = (e) => {
    clearState();
    setBrandId(e.id);
  };
  const handleCloseAddBrand = (reload = true) => {
    setShowAdd(false);
    setBrandId(null);
    if (reload) {
      brandGetAll();
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-semibold">Brand Management</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[var(--color-fdaa3d)] text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            + Add Brand
          </button>
        </div>

        <Table
          data={data}
          onDelete={(e) => handleDeleteClick(e)}
          onView={(e) => handleView(e)}
        />

        {showAdd && <AddBrand onClose={handleCloseAddBrand} onAdd={addBrand} />}

        {brandId && (
          <BrandDetail brandId={brandId} onClose={handleCloseAddBrand} />
        )}
      </div>

      {confirmId && (
        <ConfirmModal
          open={true}
          title="Delete product?"
          message="This action cannot be undone."
          confirmText="Delete"
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
             brandDeleteById(confirmId)
              .then(() => {
                brandGetAll();
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

export default Brands;
