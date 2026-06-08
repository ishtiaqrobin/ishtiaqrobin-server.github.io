import { z } from "zod";

const createReviewZodSchema = z.object({
  rating: z.number("rating is required").min(1).max(5),
  comment: z.string("comment is required").min(2).max(200),
});

// User can only update rating and comment
const updateReviewZodSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(2).max(200).optional(),
});

// Admin can also toggle isApproved and isPinned
const adminUpdateReviewZodSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(2).max(200).optional(),
  isApproved: z.boolean().optional(),
  isPinned: z.boolean().optional(),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
  adminUpdateReviewZodSchema,
};
