import express, { Router } from "express";
import { CategoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { CategoryValidation } from "./category.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Get all categories
router.get("/", CategoryController.getCategories);

// Create category
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(CategoryValidation.createCategoryZodSchema),
  CategoryController.createCategory,
);

// Update category
router.put(
  "/:categoryId",
  auth(UserRole.ADMIN),
  validateRequest(CategoryValidation.updateCategoryZodSchema),
  CategoryController.updateCategory,
);

// Delete category
router.delete(
  "/:categoryId",
  auth(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRouter: Router = router;
