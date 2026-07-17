import { z } from "zod";

// Multipart form থেকে "true"/"false" string → boolean coerce
const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === "boolean") return val;
    return val === "true" || val === "on";
  });

// Multipart form থেকে number string → number coerce
const numberFromString = z
  .union([z.number(), z.string()])
  .transform((val) => {
    if (typeof val === "number") return val;
    return Number(val);
  })
  .pipe(z.number());

// tags: JSON string অথবা array — দুটোই handle করবে
const tagsField = z
  .union([z.array(z.string()), z.string()])
  .transform((val) => {
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // comma-separated fallback
      return val
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    return [val];
  })
  .pipe(z.array(z.string()).nonempty("At least one tag is required"));

const sectionsField = z
  .union([z.array(z.any()), z.string()])
  .transform((val) => {
    if (Array.isArray(val)) return val;
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  })
  .optional();

const createProjectZodSchema = z.object({
  title: z.string().min(1, "title is required"),
  slug: z.string().min(1, "slug is required"),
  description: z.string().min(1, "description is required"),
  tags: tagsField,
  categoryId: z.string().min(1, "categoryId is required"),
  thumbnail: z.string().optional(),
  bannerImage: z.string().optional(),
  year: z.string().optional(),
  bgColor: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  roles: z.string().optional(),
  client: z.string().optional(),
  techStack: tagsField.optional(),
  sections: sectionsField,
  isFeatured: booleanFromString.optional(),
  isPublished: booleanFromString.optional(),
  sortOrder: numberFromString.optional(),
});

const updateProjectZodSchema = createProjectZodSchema.partial();

export const ProjectValidation = {
  createProjectZodSchema,
  updateProjectZodSchema,
};
