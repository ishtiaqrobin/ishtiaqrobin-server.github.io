import { prisma } from "../../lib/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.interface";

// Create category
const createCategory = async (payload: CreateCategoryInput) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

// Get all categories
const getCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};

// Update category
const updateCategory = async (
  categoryId: string,
  payload: UpdateCategoryInput,
) => {
  const result = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: payload,
  });

  return result;
};

// Delete category
const deleteCategory = async (categoryId: string) => {
  const result = await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  return result;
};

export const CategoryService = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
