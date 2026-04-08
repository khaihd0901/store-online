import Modal from "../../components/TableModal/Modal";
import CustomerInput from "../../components/CustomerInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCallback, useEffect, useState } from "react";
import UploadImage from "./UploadImage";
import { useProductStore } from "../../stores/productStore";
import { useCategoryStore } from "../../stores/categoryStore";
import { useBrandStore } from "../../stores/brandStore";

const DetailProduct = ({ onClose, prodId }) => {
  const [images, setImages] = useState();
  const [deletedImages, setDeletedImages] = useState();

  const {productGetById, product, productUploadImages,productUpdate, isSuccess, isLoading} = useProductStore();
    const {categoryGetAll, categories} = useCategoryStore();
    const {brandGetAll, brands} = useBrandStore();

  useEffect(() => {
    categoryGetAll();
    brandGetAll();

  }, []);

  useEffect(() =>{
    productGetById(prodId)
  },[])

  const handleImageChange = useCallback((files, removedAssetIds) => {
    setImages(files);
    setDeletedImages(removedAssetIds);
  }, []);

  let validationSchema = Yup.object({
    title: Yup.string().required("Product name is required"),
    category: Yup.string().required("Category is required"),
    brand: Yup.string().required("Brand is required"),
    price: Yup.number().required("Price is required"),
    unit: Yup.string().required("Unit is required"),
    weight: Yup.number().required("Weight is required"),
    stock: Yup.number().required("Stock is required"),
    tags: Yup.array().required("tags is required"),
    des: Yup.string().required("des is required"),
    // harvestDate: Yup.date().required("Harvest Date date is required"),
    // expiryDate: Yup.date().required("Expiry date is required"),
    origin: Yup.string().required("origin is required"),
    farmName: Yup.string().required("farmName is required"),
    storage: Yup.string().required("storage is required"),
  });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: product?.title || "",
      category: product?.category || "",
      brand: product?.brand || "",
      price: product?.price || "",
      discount: product?.discount || 0,
      unit: product?.unit || "",
      weight: product?.weight || 0,
      stock: product?.stock || 0,
      tags: product?.tags || [],
      des: product?.des || "",
      // harvestDate: product.harvestDate || "",
      // expiryDate: product.expiryDate || "",
      origin: product?.origin || "",
      farmName: product?.farmName || "",
      isOrganic: product?.isOrganic || false,
      storage: product?.storage || "",
    },
    validationSchema,
    onSubmit: async (values) => {
      let uploadedImages = [];

      if (images?.length > 0) {
        uploadedImages = await productUploadImages(images);
      }
      console.log("uploadedImages", uploadedImages)
      await productUpdate({
          id: prodId,
          data: {
            ...values,
            newImages: uploadedImages,
            removedImages: deletedImages,
          },
        })
    },
  });

  useEffect(() => {
    if (isSuccess) {
      onClose(true);
    }
  }, []);

  return (
    <Modal onClose={onClose} onSubmit={formik.handleSubmit}>
      {/* 🔥 RELATIVE WRAPPER */}
      <div className="relative">
        {/* 🔥 LOADING OVERLAY */}

        <h2 className="text-lg font-semibold mb-4">Product Detail</h2>

        <div className="p-4 bg-gray-100 min-w-5xl">
          <div className="grid grid-cols-12 gap-4">
            {/* LEFT */}
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
                      onChange={formik.handleChange("tags")}
                      value={formik.values.tags}
                      type="text"
                      label="product tag"
                      placeholder="Type and enter"
                      i_class="w-full mb-3 pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                    />

                    {formik.touched.tags && formik.errors.tags ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.tags}
                      </div>
                    ) : null}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">Product type</span>
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
                      <span className="font-medium">Product brand</span>
                      <select
                        name="brand"
                        value={formik.values.brand}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
    rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
    focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      >
                        <option value="">Select brand</option>
                        {brands?.map((b, index) => (
                          <option key={index} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                      {formik.touched.brand && formik.errors.brand ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.brand}
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
                  </div>
                  {/* EXTRA */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col-gap-2">
                      <CustomerInput
                        label="Origin"
                        value={formik.values.origin}
                        onChange={formik.handleChange("origin")}
                        i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      />
                      {formik.touched.origin && formik.errors.origin ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.origin}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <CustomerInput
                        label="Farm name"
                        value={formik.values.farmName}
                        onChange={formik.handleChange("farmName")}
                        i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      />
                      {formik.touched.farmName && formik.errors.farmName ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.farmName}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="flex gap-2 items-center select-none">
                        <input
                          type="checkbox"
                          checked={formik.values.isOrganic}
                          onChange={() =>
                            formik.setFieldValue(
                              "isOrganic",
                              !formik.values.isOrganic,
                            )
                          }
                        />
                        Organic product
                      </label>
                    </div>
                  </div>

                  {/* VEGETABLE INFO */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="font-medium">Product Unit</span>
                      <select
                        name="unit"
                        value={formik.values.unit}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
    rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
    focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      >
                        <option value="kg">Kg</option>
                        <option value="g">Gram</option>
                        <option value="bundle">Bundle</option>
                        <option value="piece">Piece</option>
                      </select>
                      {formik.touched.unit && formik.errors.unit ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.unit}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <CustomerInput
                        type="number"
                        label="Weight"
                        value={formik.values.weight}
                        i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                        onChange={formik.handleChange("weight")}
                      />
                      {formik.touched.weight && formik.errors.weight ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.weight}
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

                  {/* DATES */}
                  {/* <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <CustomerInput
                        i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                        type="date"
                        label="Harvest date"
                        value={formik.values.harvestDate}
                        onChange={formik.handleChange("harvestDate")}
                      />
                      {formik.touched.harvestDate &&
                      formik.errors.harvestDate ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.harvestDate}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                      <CustomerInput
                        i_class="w-full pl-4 pr-4 py-2.5 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                        type="date"
                        label="Expiry date"
                        value={formik.values.expiryDate}
                        onChange={formik.handleChange("expiryDate")}
                      />

                      {formik.touched.expiryDate && formik.errors.expiryDate ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.expiryDate}
                        </div>
                      ) : null}
                    </div>
                  </div> */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <textarea
                        onChange={formik.handleChange("des")}
                        value={formik.values.des}
                        maxLength={200}
                        className="border rounded-xl px-3 py-2 w-full min-h-20 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                        placeholder="Description"
                      />

                      {formik.touched.des && formik.errors.des ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.des}
                        </div>
                      ) : null}
                    </div>

                    <div className="flex flex-col gap-2">
                      <textarea
                        placeholder="Storage instructions"
                        onChange={formik.handleChange("storage")}
                        value={formik.values.storage}
                        className="border rounded-xl px-3 py-2 w-full min-h-20 bg-gray-100 border border-gray-300
            rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none 
            focus:ring-2 focus:ring-[var(--color-fdaa3d)] focus:border-transparent transition-all"
                      />

                      {formik.touched.storage && formik.errors.storage ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.storage}
                        </div>
                      ) : null}
                    </div>
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
