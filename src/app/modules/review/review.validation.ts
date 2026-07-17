import { z } from "zod";

const createReviewZodSchema = z.object({
  position: z.string("position is required").min(1).max(50),
  companyName: z.string("company name is required").min(1).max(50),
  comment: z.string("comment is required").min(20).max(500),
});

// User can update position, company name, and comment
const updateReviewZodSchema = z.object({
  position: z.string().min(1).max(50).optional(),
  companyName: z.string().min(1).max(50).optional(),
  comment: z.string().min(20).max(500).optional(),
});

// Admin can also toggle isApproved and isPinned
const adminUpdateReviewZodSchema = z.object({
  position: z.string().min(1).max(50).optional(),
  companyName: z.string().min(1).max(50).optional(),
  comment: z.string().min(20).max(500).optional(),

  isApproved: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
  adminUpdateReviewZodSchema,
};
