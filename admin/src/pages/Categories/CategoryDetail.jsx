import Modal from "../../components/TableModal/Modal";
import CustomerInput from "../../components/CustomerInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useCategoryStore } from "../../stores/categoryStore";
import DetailProduct from "../Products/DetailProduct";
import { EditIcon } from "lucide-react";

export default function CategoryDetail({ categoryId, onClose }) {
  const {
    categoryGetById,
    categoryUpdate,
    isSuccess,
    isLoading,
    category,
    books,
    pagination,
  } = useCategoryStore();

  const [productId, setProductId] = useState(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (categoryId) {
      categoryGetById(categoryId, page);
    }
  }, [categoryId, page]);
  const validationSchema = Yup.object({
    categoryName: Yup.string().required("Name is required"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      categoryName: category?.category?.categoryName || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await categoryUpdate({
        id: categoryId,
        data: values,
      });
    },
  });

  // CLOSE AFTER SUCCESS
  useEffect(() => {
    if (isSuccess) {
      onClose(true);
    }
  }, [isSuccess]);

  return (
    <Modal onClose={onClose}>
      <div className="relative">
        <div className="p-4 bg-gray-100 min-w-5xl">
          <div className="grid grid-cols-12 gap-4">

            {/* RIGHT */}
            <div className="col-span-12 space-y-6">

              <div className="bg-gray-100 rounded-xl border border-gray-200 shadow-xl p-4">

                <h3 className="font-semibold mb-4">
                  General Information
                </h3>

                {/* CATEGORY NAME */}
                <div className="space-y-4">
                  <CustomerInput
                    onChange={formik.handleChange("categoryName")}
                    value={formik.values.categoryName}
                    type="text"
                    label="category name"
                    i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl"
                    placeholder="Category Name"
                  />

                  {formik.touched.categoryName &&
                    formik.errors.categoryName && (
                      <div className="text-red-500 text-sm">
                        {formik.errors.categoryName}
                      </div>
                    )}
                </div>

                {/* BOOK LIST */}
                <div className="space-y-3 mt-4">
                  {books?.map((book) => (
                    <div
                      key={book._id}
                      className="p-3 border rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                      onClick={() => setProductId(book._id)}
                    >
                      <div className="left">
                        
                      <p className="font-semibold">{book.title}</p>
                      <p className="text-gray-500 text-sm">
                        {book.author}
                      </p>
                      </div>
                      <EditIcon/>
                    </div>
                  ))}
                </div>

                {/* PAGINATION */}
                {pagination?.totalPages > 1 && (
                  <div className="flex gap-2 mt-4">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`px-3 py-1 rounded ${
                          page === p
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="border px-4 py-2 rounded-lg"
            disabled={isLoading}
          >
            Close
          </button>

          <button
            onClick={formik.handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            disabled={isLoading}
          >
            Update
          </button>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-white/70 flex items-center justify-center rounded-xl">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {/* PRODUCT MODAL */}
      {productId && (
        <DetailProduct
          prodId={productId}
          onClose={(reload) => {
            setProductId(null);

            if (reload) {
              categoryGetById(categoryId, page);
            }
          }}
        />
      )}
    </Modal>
  );
}