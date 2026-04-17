import express from "express";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getProducts,
  uploadProductImages,
  deleteProductImage,
  searchProducts,
  toggleHotProduct,
} from "../controllers/productController.js";
import { protectedRoute, isAdmin } from "../middlewares/authMiddleware.js";
import { productImageReSize, uploadPhoto } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post("/create-product", protectedRoute, isAdmin, createProduct);
router.get("/", getProducts);
router.get("/search", searchProducts);
router.put("/update/:id", protectedRoute, isAdmin, updateProduct);
router.put("/toggle-hot/:id", protectedRoute, isAdmin,toggleHotProduct);
router.delete("/:id", protectedRoute, isAdmin, deleteProduct);
router.put(
  "/upload",
  protectedRoute,
  isAdmin,
  uploadPhoto.array("images", 5),
  productImageReSize,
  uploadProductImages,
);
router.delete("/delete-image/:id", protectedRoute, isAdmin, deleteProductImage);
router.get("/:id", getProductById);

export default router;
