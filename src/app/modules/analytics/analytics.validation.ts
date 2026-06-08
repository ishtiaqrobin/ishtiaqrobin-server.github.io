import { z } from "zod";

const createPageViewZodSchema = z.object({
  page: z.string("Page is required"),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  referrer: z.string().optional(),
});

const createResumeDownloadLogZodSchema = z.object({
  ipAddress: z.string().optional(),
  country: z.string().optional(),
  userAgent: z.string().optional(),
});

export const AnalyticsValidation = {
  createPageViewZodSchema,
  createResumeDownloadLogZodSchema,
};
