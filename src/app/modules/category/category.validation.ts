import { z } from "zod";

const createCategoryZodSchema = z.object({
  name: z.string("Name is required"),
  isPublished: z.boolean().optional().default(true),
});

const updateCategoryZodSchema = z.object({
  name: z.string("Name is required").optional(),
  isPublished: z.boolean().optional(),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
