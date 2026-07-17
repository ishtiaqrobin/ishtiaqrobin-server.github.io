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

const responsibilitiesField = z
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

const createExperienceZodSchema = z.object({
  position: z.string().min(1, "position is required"),
  companyName: z.string().min(1, "companyName is required"),
  startDate: z.string().min(1, "startDate is required"),
  endDate: z.string().optional().nullable(),
  companyUrl: z.string().optional().nullable(),
  companyLogo: z.string().optional().nullable(),
  responsibilities: responsibilitiesField,
  isPublished: booleanFromString.optional(),
  sortOrder: numberFromString.optional(),
});

const updateExperienceZodSchema = createExperienceZodSchema.partial();

export const ExperienceValidation = {
  createExperienceZodSchema,
  updateExperienceZodSchema,
};
