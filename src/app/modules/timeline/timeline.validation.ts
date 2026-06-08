import { z } from "zod";

const createTimelineZodSchema = z.object({
  title: z.string("Title is required"),
  description: z.string().optional(),
  date: z.coerce.date("Date is required"),
  icon: z.string().optional(),
  color: z.string().optional(),
  url: z.string().url().optional(),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
});

const updateTimelineZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  url: z.string().url().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const TimelineValidation = {
  createTimelineZodSchema,
  updateTimelineZodSchema,
};
