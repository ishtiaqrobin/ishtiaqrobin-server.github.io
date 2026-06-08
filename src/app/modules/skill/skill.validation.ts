import { z } from "zod";
import { SkillLevel } from "../../../generated/prisma";

const createSkillZodSchema = z.object({
  name: z.string("name is required"),
  level: z.enum(SkillLevel, "Invalid skill level"),
  icon: z
    .object({
      name: z.string(),
      library: z.string(),
      color: z.string(),
    })
    .optional(),
  categoryId: z.string("categoryId is required"),
  sortOrder: z.number().default(0),
});

const updateSkillZodSchema = z.object({
  name: z.string().optional(),
  level: z.enum(SkillLevel, "Invalid skill level").optional(),
  icon: z
    .object({
      name: z.string().optional(),
      library: z.string().optional(),
      color: z.string().optional(),
    })
    .optional(),
  categoryId: z.string().optional(),
  sortOrder: z.number().optional(),
});

export const SkillValidation = {
  createSkillZodSchema,
  updateSkillZodSchema,
};
