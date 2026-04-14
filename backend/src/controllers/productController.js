import Product from "../models/Product.js";
import User from "../models/User.js";
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
      { session }
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
  const products = await Product.find()
    .populate("category")
  res.status(200).json(products);
});

// ============================
// SEARCH AND FILTER PRODUCTS
// ============================
// export const searchProducts = asyncHandler(async (req, res) => {
//   // 1️⃣ Clone query object
//   const queryObj = { ...req.query };
//   console.log(queryObj)
//   const excludeFields = ["page", "sort", "limit", "fields", "search"];
//   excludeFields.forEach((el) => delete queryObj[el]);

//   // 2️⃣ Advanced filtering (gte, lte, etc.)
//   let queryStr = JSON.stringify(queryObj);
//   queryStr = queryStr.replace(
//     /\b(gte|gt|lte|lt)\b/g,
//     (match) => `$${match}`
//   );

//   let parsedQuery = JSON.parse(queryStr);

//   // 3️⃣ Search (text search)
// if (req.query.search) {
//   parsedQuery.$or = [
//     { title: { $regex: req.query.search, $options: "i" } },
//   ];
// }
// console.log("FINAL QUERY:", parsedQuery);

//   // 4️⃣ Build query
//   let query = Product.find(parsedQuery)
//     .populate("category")
//     .populate("brand");

//   // 5️⃣ Sorting
//   if (req.query.sort) {
//     query = query.sort(req.query.sort.split(",").join(" "));
//   } 
//   // else if (req.query.search) {
//   //   // sort by relevance when searching
//   //   query = query.sort({ score: { $meta: "textScore" } });
//   // } 
//   else {
//     query = query.sort("-harvestDate");
//   }

//   // 6️⃣ Field limiting
//   if (req.query.fields) {
//     query = query.select(req.query.fields.split(",").join(" "));
//   }

//   // 7️⃣ Pagination
//   const page = Number(req.query.page) || 1;
//   const limit = Number(req.query.limit) || 20;
//   const skip = (page - 1) * limit;

//   query = query.skip(skip).limit(limit);

//   // 8️⃣ Execute
//   const products = await query;
//   res.status(200).json(products);
// });
export const searchProducts = asyncHandler(async (req, res) => {
  // 1️⃣ Clone query
  const queryObj = { ...req.query };

  const excludeFields = ["page", "sort", "limit", "fields", "search"];
  excludeFields.forEach((el) => delete queryObj[el]);

  // 2️⃣ Advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  const filterQuery = JSON.parse(queryStr);

  // 3️⃣ Build FINAL query
  let mongoQuery = {};

  // 👉 nếu có filter
  if (Object.keys(filterQuery).length > 0) {
    mongoQuery.$and = [{ ...filterQuery }];
  }

  // 👉 nếu có search
  if (req.query.search) {
    const searchQuery = {
      $or: [
        { title: { $regex: req.query.search, $options: "i" } },
        // thêm field khác nếu muốn
        // { description: { $regex: req.query.search, $options: "i" } },
      ],
    };

    mongoQuery.$and
      ? mongoQuery.$and.push(searchQuery)
      : (mongoQuery = searchQuery);
  }

  console.log("FINAL QUERY:", JSON.stringify(mongoQuery, null, 2));

  // 4️ Build query
  let query = Product.find(mongoQuery)
    .populate("category")

  // 5️ Sorting
  if (req.query.sort) {
    query = query.sort(req.query.sort.split(",").join(" "));
  } else {
    query = query.sort("-createdAt");
  }

  // 6️ Field limiting
  if (req.query.fields) {
    query = query.select(req.query.fields.split(",").join(" "));
  }

  // 7️⃣ Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // 8️⃣ Execute
  const products = await query;
  res.status(200).json(products);
});

// ============================
// GET PRODUCT BY ID
// ============================
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("category")

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
      (img) => !removedImages.includes(img.public_id)
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
      $pull: { products: saved._id },
    });

    await Category.findByIdAndUpdate(newCategory, {
      $addToSet: { products: saved._id },
    });
  }

  if (!oldCategory && newCategory) {
    await Category.findByIdAndUpdate(newCategory, {
      $addToSet: { products: saved._id },
    });
  }

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
    await Promise.all(imgIds.map((id => deleteImage(id) )))
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
// RATE PRODUCT
// ============================
export const ratingProduct = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;

  const product = await Product.findById(prodId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const existingRating = product.ratings.find(
    (r) => r.postedBy.toString() === _id.toString()
  );

  if (existingRating) {
    existingRating.star = star;
    existingRating.comment = comment;
  } else {
    product.ratings.push({ star, comment, postedBy: _id });
  }

  product.ratingsQuantity = product.ratings.length;
  product.ratingsAverage =
    product.ratings.reduce((sum, r) => sum + r.star, 0) /
    product.ratingsQuantity;

  await product.save();

  res.status(200).json({ message: "Rating submitted successfully" });
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
