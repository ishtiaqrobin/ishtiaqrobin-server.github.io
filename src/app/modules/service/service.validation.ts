import { z } from "zod";

const createServiceZodSchema = z.object({
  name: z.string("name is required"),
  icon: z
    .object({
      name: z.string(),
      library: z.string(),
      color: z.string(),
      bgColor: z.string(),
    })
    .optional(),
  description: z.string().optional(),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

const updateServiceZodSchema = createServiceZodSchema.partial();

export const ServiceValidation = {
  createServiceZodSchema,
  updateServiceZodSchema,
};
