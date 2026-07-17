import { z } from "zod";

const createExperienceZodSchema = z.object({
  company: z.string("company is required"),
  title: z.string("title is required"),
  startDate: z.string("startDate is required"),
  endDate: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  description: z.string("description is required"),
  companyUrl: z.string().optional().nullable(),
  companyLogo: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

const updateExperienceZodSchema = createExperienceZodSchema.partial();

export const ExperienceValidation = {
  createExperienceZodSchema,
  updateExperienceZodSchema,
};
