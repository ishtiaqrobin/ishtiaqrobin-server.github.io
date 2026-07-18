import { z } from "zod";

const numberFromString = z.union([z.number(), z.string().transform((val) => Number(val))]);

const createCategoryZodSchema = z.object({
  name: z.string("Name is required"),
  sortOrder: numberFromString.optional(),
  isPublished: z.boolean().optional().default(true),
});

const updateCategoryZodSchema = z.object({
  name: z.string("Name is required").optional(),
  sortOrder: numberFromString.optional(),
  isPublished: z.boolean().optional(),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
