import { z } from "zod";

const createAboutZodSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  heroImg: z.string().optional(),
  aboutMeImg: z.string().optional(),
  resumeUrl: z.string().optional(),
});

const updateAboutZodSchema = createAboutZodSchema.partial();

export const AboutValidation = {
  createAboutZodSchema,
  updateAboutZodSchema,
};
