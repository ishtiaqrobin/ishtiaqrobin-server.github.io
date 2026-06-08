import { z } from "zod";

const createVideoZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  videoUrl: z.string("Video URL is required").url("Invalid video URL"),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

const updateVideoZodSchema = createVideoZodSchema.partial();

export const VideoValidation = {
  createVideoZodSchema,
  updateVideoZodSchema,
};
