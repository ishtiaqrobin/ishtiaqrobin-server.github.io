import { z } from "zod";
import { sanitizeText, sanitizeRichContent, sanitizeUrl } from "../../utils/sanitize";

// ── Reusable multipart-aware primitives ───────────────────

// Multipart form থেকে "true"/"false"/"on" string → boolean
const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === "boolean") return val;
    return val === "true" || val === "on" || val === "1";
  });

// Multipart form থেকে number string → number
const numberFromString = z
  .union([z.number(), z.string()])
  .transform((val) => {
    if (typeof val === "number") return val;
    const n = Number(val);
    return Number.isNaN(n) ? 0 : n;
  })
  .pipe(z.number());

// JSON string অথবা array — দুটোই handle করবে
const stringArrayField = z
  .union([z.array(z.string()), z.string()])
  .transform((val) => {
    if (Array.isArray(val)) return val;
    const trimmed = val.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // comma-separated fallback
    }
    return trimmed
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  })
  .pipe(z.array(z.string()));

const optionalText = z
  .string()
  .optional()
  .transform((v) => (v === undefined ? undefined : sanitizeText(v)));

const optionalRichText = z
  .string()
  .optional()
  .transform((v) => (v === undefined ? undefined : sanitizeRichContent(v)));

const optionalUrl = z
  .string()
  .optional()
  .nullable()
  .transform((v) => (v === undefined || v === null ? undefined : sanitizeUrl(v)));

const blogStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

// ── Blog ──────────────────────────────────────────────────

const createBlogZodSchema = z.object({
  title: z
    .string("title is required")
    .min(1, "title is required")
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length > 0, "title cannot be empty"),

  slug: optionalText,

  excerpt: optionalText,

  // Rich HTML from Tiptap — sanitized with the rich-content profile
  content: z
    .string("content is required")
    .min(1, "content is required")
    .transform((v) => sanitizeRichContent(v))
    .refine((v) => v.length > 0, "content cannot be empty"),

  thumbnail: optionalUrl,
  coverImageAlt: optionalText,

  status: blogStatusEnum.optional(),
  isFeatured: booleanFromString.optional(),
  isPinned: booleanFromString.optional(),
  publishedAt: z
    .union([z.string(), z.date()])
    .optional()
    .nullable()
    .transform((v) => {
      if (v === undefined || v === null || v === "") return undefined;
      const d = v instanceof Date ? v : new Date(v);
      return Number.isNaN(d.getTime()) ? undefined : d;
    }),

  authorName: optionalText,
  readingTime: numberFromString.optional(),

  metaTitle: optionalText,
  metaDescription: optionalText,
  canonicalUrl: optionalUrl,
  ogImage: optionalUrl,

  tagIds: stringArrayField.optional(),
  tagNames: stringArrayField.optional(),
});

const updateBlogZodSchema = createBlogZodSchema.partial();

// ── Blog Tag ──────────────────────────────────────────────

const createBlogTagZodSchema = z.object({
  name: z
    .string("name is required")
    .min(1, "name is required")
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length > 0, "name cannot be empty"),
  slug: optionalText,
});

// ── Blog Comment (PUBLIC — highest risk surface) ──────────

const createBlogCommentZodSchema = z.object({
  name: z
    .string("name is required")
    .min(1, "name is required")
    .max(80, "name is too long")
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length > 0, "name cannot be empty"),

  email: z
    .string("email is required")
    .email("invalid email address")
    .max(160, "email is too long")
    .transform((v) => sanitizeText(v)),

  comment: z
    .string("comment is required")
    .min(2, "comment is too short")
    .max(2000, "comment is too long")
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length > 0, "comment cannot be empty"),

  parentId: optionalText,
});

export const BlogValidation = {
  createBlogZodSchema,
  updateBlogZodSchema,
  createBlogTagZodSchema,
  createBlogCommentZodSchema,
};
