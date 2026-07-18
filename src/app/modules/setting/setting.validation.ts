import { z } from "zod";

const updateSettingsZodSchema = z.object({
  // Social Links
  linkedinUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  facebookUrl: z.string().url().optional().or(z.literal("")),
  instagramUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  youtubeUrl: z.string().url().optional().or(z.literal("")),

  // Contact info
  resumeLink: z.string().url().optional().or(z.literal("")),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  address: z.string().optional(),

  // Availability & meta
  availability: z.string().optional(),
  experience: z.string().optional(),

  // SEO
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

export const SettingValidation = {
  updateSettingsZodSchema,
};
