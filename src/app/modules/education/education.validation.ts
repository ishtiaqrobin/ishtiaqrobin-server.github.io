import { z } from "zod";

const createEducationZodSchema = z.object({
  degree: z.string("degree is required"),
  institution: z.string("institution is required"),
  startDate: z.string("startDate is required"),
  result: z.string("result is required"),
  board: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  group: z.string().optional().nullable(),
  // description: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

const updateEducationZodSchema = createEducationZodSchema.partial();

export const EducationValidation = {
  createEducationZodSchema,
  updateEducationZodSchema,
};
