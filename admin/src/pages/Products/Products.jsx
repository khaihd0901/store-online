/* eslint-disable react-hooks/preserve-manual-memoization */
import { useEffect, useCallback, useState } from "react";
import Table from "../../components/TableModal/Table";
import AddProduct from "./AddProduct";
import DetailProduct from "./DetailProduct";
import ConfirmModal from "../../components/ConfirmDialog";
import { useProductStore } from "../../stores/productStore";
import { useCategoryStore } from "../../stores/categoryStore";

export default function Product() {
  const {
    productSearch,
    pagination,
    clearState,
    productDeleteById,
    toggleHotProduct,
    isLoading,
  } = useProductStore();
  const {categoryGetAll, categories} = useCategoryStore();
  const data = useProductStore((s) => s.products);

  const [prodId, setProdId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sort, setSort] = useState("desc");
  const [filters, setFilters] = useState({});
  console.log(sort)
const fetchProducts = useCallback(async () => {
  const params = {
    page,
    limit,
    sort: `${sort === "asc" ? "" : "-"}${sortKey}`,
    ...filters,
  };

  if (search) params.search = search;

  await productSearch(params);
}, [page, limit, sortKey, sort, search, filters, productSearch]);

  useEffect(() => {
    categoryGetAll();
    fetchProducts();
  }, [fetchProducts]);

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
        onClick={async () => {
          await toggleHotProduct(item._id);
          fetchProducts();
        }}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition
        ${item.isHot ? "bg-red-500" : "bg-gray-400"}`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition
          ${item.isHot ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    ),
    price: item.price,
  }));

  const handleCloseAddProduct = async (reload = false) => {
    setShowAdd(false);
    if (reload) {
      await fetchProducts();
    }
  };

  const handleCloseDetail = async (reload = false) => {
    clearState();
    setProdId(null);
    if (reload) {
      await fetchProducts();
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSort((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSort("asc");
    }
  };

  const handleFilter = (key, value) => {
  setPage(1); // 🔥 reset page
  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
};
  return (
    <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Product Management</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-[var(--color-fdaa3d)] text-white px-4 py-2 rounded-xl"
        >
          + Add Product
        </button>
      </div>

      <Table
        data={products}
        onDelete={(e) => setConfirmId(e.id)}
        onView={(e) => setProdId(e.id)}
        onSort={handleSort}
        sortKey={sortKey}
        sortOrder={sort}
        onFilter={handleFilter}
        categories={categories}
      />

      {/* pagination */}
      <div className="flex gap-2 mt-4">
        {[...Array(pagination?.totalPages || 1)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showAdd && <AddProduct onClose={handleCloseAddProduct} />}

      {prodId && <DetailProduct prodId={prodId} onClose={handleCloseDetail} />}

      {confirmId && (
        <ConfirmModal
          open={true}
          title="Delete product?"
          message="This action cannot be undone."
          confirmText={isLoading ? "Deleting..." : "Delete"}
          disabled={isLoading}
          onCancel={() => setConfirmId(null)}
          onConfirm={async () => {
            await productDeleteById(confirmId);
            setConfirmId(null);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
}
