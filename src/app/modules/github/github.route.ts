import express, { Router } from "express";
import { GithubController } from "./github.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { GithubValidation } from "./github.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// ─── GitHub Stats ───

// Get cached GitHub stats (public)
router.get("/stats", GithubController.getGithubStats);

// Sync GitHub stats from the GitHub API (admin)
router.post(
  "/stats/sync",
  auth(UserRole.ADMIN),
  GithubController.syncGithubStats,
);

// ─── Open Source Contributions ───

// Get all published contributions (public)
router.get("/contributions", GithubController.getAllContributions);

// Get all contributions including unpublished (admin)
router.get(
  "/contributions/admin",
  auth(UserRole.ADMIN),
  GithubController.getAllContributionsAdmin,
);

// Get a single contribution by ID (admin)
router.get(
  "/contributions/:contributionId",
  auth(UserRole.ADMIN),
  GithubController.getContributionById,
);

// Create a contribution (admin)
router.post(
  "/contributions",
  auth(UserRole.ADMIN),
  validateRequest(GithubValidation.createContributionZodSchema),
  GithubController.createContribution,
);

// Update a contribution (admin)
router.put(
  "/contributions/:contributionId",
  auth(UserRole.ADMIN),
  validateRequest(GithubValidation.updateContributionZodSchema),
  GithubController.updateContribution,
);

// Delete a contribution (admin)
router.delete(
  "/contributions/:contributionId",
  auth(UserRole.ADMIN),
  GithubController.deleteContribution,
);

export const GithubRouter: Router = router;
