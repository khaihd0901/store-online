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

  if (!category || category.length === 0) {
    res.status(400);
    throw new Error("Product must have at least 1 category");
  }

  if (category.length > 3) {
    res.status(400);
    throw new Error("Maximum 3 category allowed");
  }

  const count = await Category.countDocuments({
    _id: { $in: category },
  });

  if (count !== category.length) {
    res.status(400);
    throw new Error("One or more category not found");
  }

  const product = await Product.create(req.body);

  res.status(201).json(product);
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
  console.log(queryObj)
  const excludeFields = ["page", "sort", "limit", "fields", "search", "minPrice", "maxPrice", "category"];
  excludeFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let filterQuery = JSON.parse(queryStr);

  // remove empty values
  Object.keys(filterQuery).forEach((key) => {
    if (filterQuery[key] === "" || filterQuery[key] == null) {
      delete filterQuery[key];
    }
  });

  // convert boolean
  if (filterQuery.hot !== undefined) {
    if (filterQuery.hot === "true") filterQuery.hot = true;
    if (filterQuery.hot === "false") filterQuery.hot = false;
  }
  
  let mongoQuery = { ...filterQuery };

  // ✅ LOGIC LỌC GIÁ
  if (req.query.minPrice || req.query.maxPrice) {
    mongoQuery.price = {};
    if (req.query.minPrice) mongoQuery.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) mongoQuery.price.$lte = Number(req.query.maxPrice);
  }

  // ✅ SAFE SEARCH
  if (req.query.search && req.query.search.trim() !== "") {
    mongoQuery.$or = [
      { title: { $regex: req.query.search.trim(), $options: "i" } },
    ];
  }

  // ==========================================
  // ✅ LOGIC MỚI: TÌM ĐÚNG VÀO CỘT categoryName
  // ==========================================
  // if (req.query.category) {
  //   const categoryNames = req.query.category.split(",");
  //   // Tìm các Category không phân biệt hoa thường
  //   const regexCategories = categoryNames.map(name => new RegExp(`^${name.trim()}$`, 'i'));
    
  //   // ✅ ĐÃ SỬA THÀNH categoryName CHUẨN VỚI MONGODB CỦA BẠN
  //   const categories = await Category.find({
  //     categoryName: { $in: regexCategories } 
  //   });

  //   if (categories.length > 0) {
  //     const categoryIds = categories.map((cat) => cat._id);
  //     mongoQuery.category = { $in: categoryIds }; // Truyền ID chuẩn của MongoDB
  //   } else {
  //     mongoQuery.category = null; // Cố tình truyền null nếu không tìm thấy để trả về 0 kết quả
  //   }
  // }

if (req.query.category) {
  const values = req.query.category.split(",");

  const objectIds = [];
  const names = [];

  values.forEach((val) => {
    const trimmed = val.trim();

    // check nếu là ObjectId hợp lệ
    if (mongoose.Types.ObjectId.isValid(trimmed)) {
      objectIds.push(new mongoose.Types.ObjectId(trimmed));
    } else {
      names.push(trimmed);
    }
  });

  let categoryIds = [...objectIds];

  // nếu có name thì query thêm
  if (names.length > 0) {
    const regexCategories = names.map(
      (name) => new RegExp(`^${name}$`, "i")
    );

    const categories = await Category.find({
      categoryName: { $in: regexCategories },
    });

    const idsFromName = categories.map((cat) => cat._id);
    categoryIds = [...categoryIds, ...idsFromName];
  }

  if (categoryIds.length > 0) {
    mongoQuery.category = { $in: categoryIds };
  } else {
    mongoQuery.category = null;
  }
}
  console.log("FINAL QUERY ĐƯỢC GỬI VÀO MONGO:", mongoQuery);

  let query = Product.find(mongoQuery).populate("category");
  
  // add sorting
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

  // ---------- CATEGORY VALIDATION ----------
  if (updateData.category) {
    if (updateData.category.length === 0) {
      res.status(400);
      throw new Error("Product must have at least 1 category");
    }

    if (updateData.category.length > 3) {
      res.status(400);
      throw new Error("Maximum 3 category allowed");
    }

    const count = await Category.countDocuments({
      _id: { $in: updateData.category },
    });

    if (count !== updateData.category.length) {
      res.status(400);
      throw new Error("Invalid category");
    }
  }

  // ---------- UPDATE ----------
  Object.assign(product, updateData);

  product.markModified("images");

  const saved = await product.save();

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