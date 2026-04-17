import Modal from "../../components/TableModal/Modal";
import CustomerInput from "../../components/CustomerInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useEffect, useState } from "react";
import UploadImage from "./UploadImage";
import { useProductStore } from "../../stores/productStore";
import { useCategoryStore } from "../../stores/categoryStore";

const DetailProduct = ({ onClose, prodId }) => {
  const [images, setImages] = useState();
  const [deletedImages, setDeletedImages] = useState();

  const {
    productGetById,
    product,
    productUploadImages,
    productUpdate,
    isSuccess,
    isLoading,
  } = useProductStore();
  const { categoryGetAll, categories } = useCategoryStore();

  useEffect(() => {
    categoryGetAll();
  }, []);

  useEffect(() => {
    productGetById(prodId);
  }, []);

  const handleImageChange = useCallback((files, removedAssetIds) => {
    setImages(files);
    setDeletedImages(removedAssetIds);
  }, []);

  let validationSchema = Yup.object({
    title: Yup.string().required("Product name is required"),
    author: Yup.string().required("Author is required"),
    category: Yup.string().required("Category is required"),
    price: Yup.number().required("Price is required"),
    stock: Yup.number().required("Stock is required"),
    description: Yup.string().required("description is required"),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: product?.title || "",
      author: product?.author || "",
      category: product?.category?._id || "",
      price: product?.price || "",
      stock: product?.stock || 0,
      description: product?.description || "",
      isHot: product?.isHot || false, 

    },
    validationSchema,
    onSubmit: async (values) => {
      let uploadedImages = [];

      if (images?.length > 0) {
        uploadedImages = await productUploadImages(images);
      }
      console.log("uploadedImages", uploadedImages);
      await productUpdate({
        id: prodId,
        data: {
          ...values,
          newImages: uploadedImages,
          removedImages: deletedImages,
        },
      });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      onClose(true);
    }
  }, []);

  return (
    <Modal onClose={onClose} onSubmit={formik.handleSubmit}>
      <div className="relative">
        <h2 className="text-lg font-semibold mb-4">Book Detail</h2>
        <div className="p-4 bg-gray-100 min-w-5xl">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="max-w-lg h-56">
                <UploadImage
                  onChange={handleImageChange}
                  images={product?.images}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="bg-gray-100 rounded-xl border border-gray-200 shadow-xl p-4">
                <h3 className="font-semibold mb-4">General Information</h3>

                <div className="space-y-4">
                  <CustomerInput
                    onChange={formik.handleChange("title")}
                    value={formik.values.title}
                    type="text"
                    label="product name"
                    i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                    placeholder="Product Name"
                  />
                  {formik.touched.title && formik.errors.title ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.title}
                    </div>
                  ) : null}
                  <div className="grid grid-cols-1 gap-4">
                    <CustomerInput
                      onChange={formik.handleChange("author")}
                      value={formik.values.author}
                      type="text"
                      label="Author"
                      placeholder="Type and enter"
                      i_class="w-full mb-3 pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                    />

                    {formik.touched.author && formik.errors.author ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.author}
                      </div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">Category</span>
                      <select
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
    rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
    focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      >
                        <option value="">Select category</option>
                        {categories?.map((c, index) => (
                          <option key={index} value={c._id}>
                            {c.categoryName}
                          </option>
                        ))}
                      </select>
                      {formik.touched.category && formik.errors.category ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.category}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <CustomerInput
                        onChange={formik.handleChange("price")}
                        value={formik.values.price}
                        type="text"
                        label="price"
                        defaultValue="$100.00"
                        i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      />
                      {formik.touched.price && formik.errors.price ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.price}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <CustomerInput
                        onChange={formik.handleChange("stock")}
                        value={formik.values.stock}
                        defaultValue={1}
                        min={1}
                        max={1000}
                        type="number"
                        label="stock"
                        i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      />
                      {formik.touched.stock && formik.errors.stock ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.stock}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                      <span className="font-medium">Description</span>

                    <textarea
                      onChange={formik.handleChange("description")}
                      value={formik.values.description}
                      maxLength={200}
                      className="border rounded-xl px-3 py-2 w-full min-h-20 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      placeholder="description"
                    />

                    {formik.touched.description && formik.errors.description ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.description}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* BUTTONS */}
        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            type="button"
            disabled={isLoading}
            className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Close
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Save Change
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">
              Loading product...
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default DetailProduct;
