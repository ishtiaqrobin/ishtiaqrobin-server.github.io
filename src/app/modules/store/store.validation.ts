import { z } from "zod";
import { OrderStatus, ProductStatus } from "../../../generated/prisma";

// ─── Product ───

const createProductZodSchema = z.object({
  title: z.string("Title is required"),
  slug: z.string("Slug is required"),
  description: z.string("Description is required"),
  thumbnail: z.string("Thumbnail is required"),
  previewUrl: z.string().url().optional(),
  price: z.number("Price is required").nonnegative(),
  discountPrice: z
    .number("Discount price is required")
    .nonnegative()
    .optional(),
  currency: z.string().optional().default("USD"),
  status: z.nativeEnum(ProductStatus).optional().default(ProductStatus.DRAFT),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().int().optional().default(0),
  techStack: z.array(z.string()).optional().default([]),
  includes: z.array(z.string()).optional().default([]),
});

const updateProductZodSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  previewUrl: z.string().url().optional(),
  price: z.number().nonnegative().optional(),
  discountPrice: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  status: z.nativeEnum(ProductStatus).optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  techStack: z.array(z.string()).optional(),
  includes: z.array(z.string()).optional(),
});

// ─── Product Image ───

const addProductImageZodSchema = z.object({
  url: z.string("Image URL is required"),
  alt: z.string().optional(),
  sortOrder: z.number().int().optional().default(0),
});

// ─── Order ───

const createOrderZodSchema = z.object({
  buyerName: z.string("Buyer name is required"),
  buyerEmail: z.string("Buyer email is required").email(),
  amount: z.number("Amount is required").nonnegative(),
  currency: z.string().optional().default("USD"),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  productId: z.string("Product ID is required"),
});

const updateOrderZodSchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  paidAt: z.coerce.date().optional(),
  downloadToken: z.string().optional(),
  downloadCount: z.number().int().optional(),
  downloadExpiry: z.coerce.date().optional(),
});

export const StoreValidation = {
  createProductZodSchema,
  updateProductZodSchema,
  addProductImageZodSchema,
  createOrderZodSchema,
  updateOrderZodSchema,
};
