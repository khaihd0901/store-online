import { useEffect, useState } from "react";
import Table from "../../components/TableModal/Table";
import CategoryDetail from "./CategoryDetail";
import AddCategory from "./AddCategory";
import ConfirmModal from "../../components/ConfirmDialog";
import { useCategoryStore } from "../../stores/categoryStore";
import TableSkeleton from "../../components/TableSkeleton";

const Categories = () => {
  const {
    categoryDeleteById,
    categoryGetAll,
    clearState,
    categories,
    isLoading,
  } = useCategoryStore();
  const [categoryId, setCategoryId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  console.log(selectedCategory);
  const addCategory = () => {
    setShowAdd(false);
  };

  useEffect(() => {
    categoryGetAll();
  }, []);

  const data = [];
  for (let i = 0; i < categories?.length; i++) {
    data.push({
      key: i + 1,
      id: categories[i]._id,
      name: categories[i].categoryName,
      bookCount: categories[i].bookCount,
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

  const handleDeleteClick = (e) => {
    const cat = categories.find((c) => c._id === e.id);
    setSelectedCategory(cat);
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen rounded-xl shadow">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-semibold">Categories Management</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-[var(--color-febd69)] text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            + Add Category
          </button>
        </div>
        {isLoading ? (
          <TableSkeleton rows={categories.length} cols={data.length} />
        ) : (
          <Table
            data={data}
            onDelete={(e) => handleDeleteClick(e)}
            onView={(e) => handleView(e)}
          />
        )}

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

      {selectedCategory && (
        <ConfirmModal
          open={true}
          title={
            selectedCategory.bookCount > 0
              ? "Cannot Delete Category"
              : "Delete Category?"
          }
          message={
            selectedCategory.bookCount > 0
              ? "This category contains products. Please move or delete them first."
              : "This action cannot be undone."
          }
          confirmText={selectedCategory.bookCount > 0 ? "OK" : "Delete"}
          onCancel={() => setSelectedCategory(null)}
          onConfirm={() => {
            if (selectedCategory.bookCount > 0) {
              setSelectedCategory(null);
              return;
            }

            categoryDeleteById(selectedCategory._id)
              .then(() => {
                categoryGetAll();
                setSelectedCategory(null);
              })
              .catch(() => {
                setSelectedCategory(null);
              });
          }}
        />
      )}
    </>
  );
};

export default Categories;
