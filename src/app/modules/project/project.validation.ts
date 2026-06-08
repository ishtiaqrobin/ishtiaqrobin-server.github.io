// import { z } from "zod";

// const createProjectZodSchema = z.object({
//   title: z.string("title is required"),
//   description: z.string("description is required"),
//   tags: z
//     .array(z.string("tags is required"))
//     .nonempty("At least one tag is required"),
//   categoryId: z.string("categoryId is required"),
//   thumbnail: z.string().optional(),
//   liveUrl: z.string().optional(),
//   githubUrl: z.string().optional(),

//   // isFeatured: z.boolean().optional(),
//   // isPublished: z.boolean().optional(),
//   // sortOrder: z.number().optional(),

//   isFeatured: z.coerce.boolean().optional(),
//   isPublished: z.coerce.boolean().optional(),
//   sortOrder: z.coerce.number().optional(),
// });

// const updateProjectZodSchema = createProjectZodSchema.partial();

// export const ProjectValidation = {
//   createProjectZodSchema,
//   updateProjectZodSchema,
// };

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

const createProjectZodSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  tags: tagsField,
  categoryId: z.string().min(1, "categoryId is required"),
  thumbnail: z.string().optional(),
  liveUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  isFeatured: booleanFromString.optional(),
  isPublished: booleanFromString.optional(),
  sortOrder: numberFromString.optional(),
});

const updateProjectZodSchema = createProjectZodSchema.partial();

export const ProjectValidation = {
  createProjectZodSchema,
  updateProjectZodSchema,
};
