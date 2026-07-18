import { z } from "zod";

const booleanFromString = z
  .union([z.boolean(), z.string()])
  .transform((val) => {
    if (typeof val === "boolean") return val;
    return val === "true" || val === "on";
  });

const numberFromString = z
  .union([z.number(), z.string()])
  .transform((val) => {
    if (typeof val === "number") return val;
    return Number(val);
  })
  .pipe(z.number());

const detailsField = z
  .union([z.array(z.string()), z.string()])
  .transform((val) => {
    if (Array.isArray(val)) return val;
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val
        .split("\n")
        .map((r: string) => r.trim())
        .filter(Boolean);
    }
    return [val];
  });

const createAwardZodSchema = z.object({
  title: z.string().min(1, "title is required"),
  subTitle: z.string().min(1, "subTitle is required"),
  date: z.string().min(1, "date is required"),
  details: detailsField,
  isPublished: booleanFromString.optional(),
  sortOrder: numberFromString.optional(),
});

const updateAwardZodSchema = createAwardZodSchema.partial();

export const AwardValidation = {
  createAwardZodSchema,
  updateAwardZodSchema,
};
