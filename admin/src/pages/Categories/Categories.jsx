import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import CategoryDetail from "./CategoryDetail";
import AddCategory from "./AddCategory";
import ConfirmModal from "../../components/ConfirmDialog";
import { useCategoryStore } from "../../stores/categoryStore";

const Categories = () => {
  const {
    categoryDeleteById,
    categoryGetAll,
    clearState,
    categories,
  } = useCategoryStore();
  const [categoryId, setCategoryId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const addCategory = () => {
    setShowAdd(false);
  };
  const handleDeleteClick = (e) => {
    setConfirmId(e.id); // open confirm modal
  };

  useEffect(() => {
    categoryGetAll();
  }, []);

  const data = [];
  for (let i = 0; i < categories?.length; i++) {
    data.push({
      key: i + 1,
      name: categories[i].categoryName,
      books: categories[i]?.books.length || 0,
    });
  }
  const handleView = (e) => {
    clearState();
    setCategoryId(e.id);
  };
  const handleCloseAddCate = (reload = true) => {
    setShowAdd(false);
    setCategoryId(null);
    if (reload) {
      categoryGetAll();
    }
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-semibold">Categories Management</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[var(--color-fdaa3d)] text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            + Add Category
          </button>
        </div>

        <Table
          data={data}
          onDelete={(e) => handleDeleteClick(e)}
          onView={(e) => handleView(e)}
        />

        {showAdd && (
          <AddCategory onClose={handleCloseAddCate} onAdd={addCategory} />
        )}

        {categoryId && (
          <CategoryDetail
            categoryId={categoryId}
            onClose={handleCloseAddCate}
          />
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
            categoryDeleteById(confirmId)
              .then(() => {
                categoryGetAll();
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

export default Categories;
