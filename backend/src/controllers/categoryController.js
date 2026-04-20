import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
// Create a category
export const createCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    res.status(400);
    throw new Error("Brand name is required");
  }

  const category = await Category.create({ categoryName });
  res.status(201).json(category);
});

// Read all categories
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await Product.countDocuments({
        category: cat._id,
      });

      return {
        ...cat.toObject(),
        bookCount: count,
      };
    })
  );

  res.status(200).json(categoriesWithCount);
});

// Read a single category
export const getCategoryById = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  // 🔥 get products by category
  const query = {
    category: req.params.id,
  };

  const products = await Product.find(query)
    .select("title author") // only what you need
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    category,
    books: products,
    pagination: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    },
  });
});

// Update a category
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

   res.status(200).json(category);
});

// Delete a category
export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  // Check if any product is using this category
  const productCount = await Product.countDocuments({
    category: categoryId,
  });
  if (productCount > 0) {
    return res.status(400).json({
      message:
        "Cannot delete category because it still contains products. Please move or delete those products first.",
    });
  }

  await Category.findByIdAndDelete(categoryId);

  res.json({ message: "Category deleted successfully" });
});