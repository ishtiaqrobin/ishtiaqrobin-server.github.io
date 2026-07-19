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

const createFaqZodSchema = z.object({
  question: z.string().min(1, "question is required"),
  answer: z.string().min(1, "answer is required"),
  isPublished: booleanFromString.optional(),
  sortOrder: numberFromString.optional(),
});

const updateFaqZodSchema = createFaqZodSchema.partial();

export const FaqValidation = {
  createFaqZodSchema,
  updateFaqZodSchema,
};
