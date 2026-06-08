import { z } from "zod";

// RSS Config
const updateConfigZodSchema = z.object({
  isEnabled: z.boolean().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  feedUrl: z.string().url().optional(),
  language: z.string().optional(),
});

// RSS Subscriber
const subscribeZodSchema = z.object({
  email: z.string("Email is required").email("Invalid email address"),
});

export const RssValidation = {
  updateConfigZodSchema,
  subscribeZodSchema,
};
