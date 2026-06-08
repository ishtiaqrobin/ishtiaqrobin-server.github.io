import { z } from "zod";

const createContributionZodSchema = z.object({
  repoName: z.string("Repo name is required"),
  repoUrl: z.string("Repo URL is required").url("Invalid repo URL"),
  description: z.string().optional(),
  prUrl: z.string().url("Invalid PR URL").optional(),
  issueUrl: z.string().url("Invalid issue URL").optional(),
  mergedAt: z.string().datetime({ offset: true }).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

const updateContributionZodSchema = z.object({
  repoName: z.string().optional(),
  repoUrl: z.string().url("Invalid repo URL").optional(),
  description: z.string().optional(),
  prUrl: z.string().url("Invalid PR URL").optional(),
  issueUrl: z.string().url("Invalid issue URL").optional(),
  mergedAt: z.string().datetime({ offset: true }).optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export const GithubValidation = {
  createContributionZodSchema,
  updateContributionZodSchema,
};
