import { z } from "zod";

const createNpmPackageZodSchema = z.object({
  name: z.string("Package name is required"),
  description: z.string().optional(),
  npmUrl: z.string("npm URL is required").url("Invalid npm URL"),
  githubUrl: z.string().url("Invalid GitHub URL").optional(),
  weeklyDownloads: z.number().int().nonnegative().optional(),
  totalDownloads: z.number().int().nonnegative().optional(),
  version: z.string().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const updateNpmPackageZodSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  npmUrl: z.string().url("Invalid npm URL").optional(),
  githubUrl: z.string().url("Invalid GitHub URL").optional(),
  weeklyDownloads: z.number().int().nonnegative().optional(),
  totalDownloads: z.number().int().nonnegative().optional(),
  version: z.string().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const NpmValidation = {
  createNpmPackageZodSchema,
  updateNpmPackageZodSchema,
};
