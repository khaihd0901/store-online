import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import AddProduct from "./AddProduct";
import DetailProduct from "./DetailProduct";
import ConfirmModal from "../../components/ConfirmDialog";
import { useProductStore } from "../../stores/productStore";
export default function Product() {
  const { productGetAll, clearState, productDeleteById,toggleHotProduct, isLoading } =
    useProductStore();
  const data = useProductStore((s) => s.products);

  const [prodId, setProdId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const addProduct = () => {
    setShowAdd(false);
  };

  const handleDeleteClick = (e) => {
    setConfirmId(e.id);
  };

  const handleCloseAddProduct = async (reload = true) => {
    setShowAdd(false);
    if (reload) {
      await productGetAll();
    }
  };

  useEffect(() => {
    productGetAll();
  }, []);

  const products = data.map((item, index) => ({
    key: index + 1,
    id: item._id,
    name: item.title,
    author: item.author,
    category: item.category?.categoryName || "-",
    stock: item.stock,
    sold: item.sold,
      hotStatus: (
        <button
          onClick={() => toggleHotProduct(item._id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition
      ${!item.isHot ? "bg-gray-400" : "bg-red-500"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition
        ${!item.isHot ? "translate-x-1" : "translate-x-6"}`}
          />
        </button>
      ),
    price: item.price,
  }));

  const handleView =  (e) => {
     clearState();
    setProdId(e.id);
  };

  const handleCloseDetail = async (shouldReload = false) => {
     clearState();
    setProdId(null);
    if (shouldReload) {
      await productGetAll(); // reload table data
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Product Management</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[var(--color-fdaa3d)] text-white px-4 py-2 rounded-xl cursor-pointer"
        >
          + Add Product
        </button>
      </div>

      <Table
        data={products}
        onDelete={(e) => handleDeleteClick(e)}
        onView={(e) => handleView(e)}
      />

      {showAdd && (
        <AddProduct onClose={handleCloseAddProduct} onAdd={addProduct} />
      )}

      {prodId && <DetailProduct prodId={prodId} onClose={handleCloseDetail} />}
      {confirmId && (
        <ConfirmModal
          open={true}
          title="Delete product?"
          message="This action cannot be undone."
          confirmText={isLoading ? "Deleting..." : "Delete"}
          disabled={isLoading}
          onCancel={() => setConfirmId(null)}
          onConfirm={() => {
            productDeleteById(confirmId)
              .then(() => {
                productGetAll();
                setConfirmId(null);
              })
              .catch(() => {
                setConfirmId(null);
              });
          }}
        />
      )}
    </div>
  );
}
