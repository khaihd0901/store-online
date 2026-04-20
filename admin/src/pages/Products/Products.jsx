/* eslint-disable react-hooks/preserve-manual-memoization */
import { useEffect, useCallback, useState } from "react";
import Table from "../../components/TableModal/Table";
import AddProduct from "./AddProduct";
import DetailProduct from "./DetailProduct";
import ConfirmModal from "../../components/ConfirmDialog";
import { useProductStore } from "../../stores/productStore";
import { useCategoryStore } from "../../stores/categoryStore";
import { Flame, FlameIcon } from "lucide-react";

export default function Product() {
  const {
    productSearch,
    pagination,
    clearState,
    productDeleteById,
    isLoading,
  } = useProductStore();
  const { categoryGetAll, categories } = useCategoryStore();
  const data = useProductStore((s) => s.products);
  console.log(data);
  const [prodId, setProdId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sort, setSort] = useState("desc");
  const [filters, setFilters] = useState({});
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
    category:
      item.category && item.category.length > 0 ? (
        <div className="flex flex-wrap gap-1 justify-center">
          {item.category.map((c) => (
            <span
              key={c._id}
              className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
            >
              {c.categoryName}
            </span>
          ))}
        </div>
      ) : (
        "-"
      ),
    stock: item.stock,
    sold: item.sold,
    hotStatus: item.isHot ? (
      <Flame className="mx-auto text-red-500" size={24} />
    ) : (
      "-"
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
    setPage(1);
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
      {data.length >= 10 && (
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
      )}

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
