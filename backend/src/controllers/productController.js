import Product from "../models/Product.js";
import { uploadImages, deleteImage } from "../utils/cloudinary.js";
import fs from "fs";
import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import mongoose from "mongoose";

// ============================
// CREATE PRODUCT
// ============================
export const createProduct = asyncHandler(async (req, res) => {
  const { category } = req.body;

  const categoryDoc = await Category.findById(category);
  if (!categoryDoc) {
    res.status(400);
    throw new Error("Category not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const product = await Product.create([req.body], { session });

    await Category.findByIdAndUpdate(
      category,
      { $addToSet: { books: product[0]._id } }, // no duplicates
      { session },
    );
    await session.commitTransaction();
    res.status(201).json(product[0]);
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});

// ============================
// GET ALL PRODUCTS
// ============================
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().populate("category");
  res.status(200).json(products);
});

// ============================
// SEARCH AND FILTER PRODUCTS
// ============================
export const searchProducts = asyncHandler(async (req, res) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "sort", "limit", "fields", "search"];
  excludeFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let filterQuery = JSON.parse(queryStr);

  // ✅ remove empty values
  Object.keys(filterQuery).forEach((key) => {
    if (filterQuery[key] === "" || filterQuery[key] == null) {
      delete filterQuery[key];
    }
  });

  // ✅ convert boolean
if (filterQuery.hot !== undefined) {
  if (filterQuery.hot === "true") filterQuery.hot = true;
  if (filterQuery.hot === "false") filterQuery.hot = false;
}

  let mongoQuery = { ...filterQuery };

  // ✅ safe search
  if (req.query.search && req.query.search.trim() !== "") {
    mongoQuery.$or = [
      { title: { $regex: req.query.search.trim(), $options: "i" } },
    ];
  }

  console.log("FINAL QUERY:", mongoQuery);

  let query = Product.find(mongoQuery).populate("category");
  // ✅ add sorting
if (req.query.sort) {
  const sortBy = req.query.sort.split(",").join(" ");
  query = query.sort(sortBy);
}

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  const products = await query;
  const total = await Product.countDocuments(mongoQuery);

  res.status(200).json({
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});
// ============================
// GET PRODUCT BY ID
// ============================
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.status(200).json(product);
});

// ============================
// UPDATE PRODUCT
// ============================
export const updateProduct = asyncHandler(async (req, res) => {
  let { removedImages = [], newImages = [], ...updateData } = req.body;
  console.log("REQ BODY:", req.body);

  if (!Array.isArray(removedImages)) {
    removedImages = JSON.parse(removedImages || "[]");
  }
  if (!Array.isArray(newImages)) {
    newImages = JSON.parse(newImages || "[]");
  }

  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // ✅ Save old references
  const oldCategory = product.category?.toString();

  // ---------- IMAGE LOGIC ----------
  if (removedImages.length > 0) {
    await Promise.all(removedImages.map((id) => deleteImage(id)));
    product.images = product.images.filter(
      (img) => !removedImages.includes(img.public_id),
    );
  }

  if (newImages.length > 0) {
    product.images = [...product.images, ...newImages];
  }

  // ---------- UPDATE PRODUCT ----------
  Object.assign(product, updateData);

  product.markModified("images");
  const saved = await product.save();

  // ✅ New references
  const newCategory = saved.category?.toString();

  // ---------- CATEGORY SYNC ----------
  if (oldCategory && newCategory && oldCategory !== newCategory) {
    await Category.findByIdAndUpdate(oldCategory, {
      $pull: { books: saved._id },
    });

    await Category.findByIdAndUpdate(newCategory, {
      $addToSet: { books: saved._id },
    });
  }

  if (!oldCategory && newCategory) {
    await Category.findByIdAndUpdate(newCategory, {
      $addToSet: { books: saved._id },
    });
  }
console.log("OLD:", oldCategory);
console.log("NEW:", updateData.category);
console.log("AFTER SAVE:", newCategory);
  res.status(200).json(saved);
});

// ============================
// DELETE PRODUCT
// ============================
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const imgIds = product.images.map((img) => img.public_id);
  if (imgIds.length > 0) {
    await Promise.all(imgIds.map((id) => deleteImage(id)));
  }
  await Product.findByIdAndDelete(req.params.id);

  if (product.category) {
    await Category.findByIdAndUpdate(product.category, {
      $pull: { products: product._id },
    });
  }

  res.status(200).json({ message: "Product deleted successfully" });
});
// ============================
// Get best selling products (for homepage)
// ============================
export const getBestSellingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find()
    .sort({ sold: -1 })
    .limit(10)
    .populate("category");

  res.status(200).json(products);
});
// ============================
// TOGGLE HOT PRODUCT
// ============================
export const toggleHotProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.isHot = !product.isHot;
  await product.save();

  res.status(200).json(product);
});
// ============================
// UPLOAD PRODUCT IMAGES
// ============================
export const uploadProductImages = asyncHandler(async (req, res) => {
  const uploader = (path) => uploadImages(path, "images");
  const urls = [];

  for (const file of req.files) {
    const newPath = await uploader(file.path);
    urls.push(newPath);
    fs.unlinkSync(file.path);
  }

  res.status(200).json(urls);
});

// ============================
// DELETE PRODUCT IMAGE
// ============================
export const deleteProductImage = asyncHandler(async (req, res) => {
  const public_id = req.params.id;
  const deletedImage = await deleteImage(public_id);

  res.status(200).json(deletedImage);
});
