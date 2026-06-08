import { NextFunction, Request, Response } from "express";
import { CategoryService } from "./category.service";

// Create category
const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all categories
const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await CategoryService.getCategories();

    res.status(201).json({
      success: true,
      message: "Retrieved all categories successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update category
const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const result = await CategoryService.updateCategory(
      categoryId as string,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Category updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete category
const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryId } = req.params;
    const result = await CategoryService.deleteCategory(categoryId as string);

    res.status(201).json({
      success: true,
      message: "Category deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const CategoryController = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
