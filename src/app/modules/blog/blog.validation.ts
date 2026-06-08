import { z } from "zod";
import { sanitizeText, sanitizeRichContent } from "../../utils/sanitize";

// ── Reusable sanitized string primitives ──────────────────
const textField = z.string().transform((v) => sanitizeText(v));
const richField = z.string().transform((v) => sanitizeRichContent(v));
const optionalText = z
  .string()
  .optional()
  .transform((v) => (v === undefined ? undefined : sanitizeText(v)));

// ── Blog ──────────────────────────────────────────────────
const createBlogZodSchema = z.object({
  title: textField.refine((v) => v.length > 0, "title is required"),
  slug: textField.refine((v) => v.length > 0, "slug is required"),
  // Rich HTML — keep safe tags only
  content: richField.refine((v) => v.length > 0, "content is required"),
  excerpt: optionalText,
  thumbnail: z.string().optional(), // URL from Cloudinary — already controlled
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFeatured: z.boolean().optional(),
  publishedAt: z.string().optional(),
  metaTitle: optionalText,
  metaDescription: optionalText,
  tagIds: z.array(z.string()).optional(),
});

const updateBlogZodSchema = createBlogZodSchema.partial();

// ── Blog Tag ──────────────────────────────────────────────
const createBlogTagZodSchema = z.object({
  name: textField.refine((v) => v.length > 0, "name is required"),
  slug: textField.refine((v) => v.length > 0, "slug is required"),
});

const updateBlogTagZodSchema = createBlogTagZodSchema.partial();

// ── Blog Comment ──────────────────────────────────────────
// Guest input — strip ALL HTML. No formatting allowed.
const createBlogCommentZodSchema = z.object({
  name: textField.refine((v) => v.length > 0, "name is required"),
  email: z
    .string("email is required")
    .email("invalid email")
    .transform((v) => sanitizeText(v).toLowerCase()),
  comment: textField.refine((v) => v.length > 0, "comment is required"),
  blogId: z.string("blogId is required"),
  parentId: z.string().optional(),
});

export const BlogValidation = {
  createBlogZodSchema,
  updateBlogZodSchema,
  createBlogTagZodSchema,
  updateBlogTagZodSchema,
  createBlogCommentZodSchema,
};
