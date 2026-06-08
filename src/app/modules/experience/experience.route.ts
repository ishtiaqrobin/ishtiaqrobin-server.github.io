import express, { Router } from "express";
import { ExperienceController } from "./experience.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { ExperienceValidation } from "./experience.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Get all experiences
router.get("/", ExperienceController.getExperiences);

// Create experience
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(ExperienceValidation.createExperienceZodSchema),
  ExperienceController.createExperience,
);

// Update experience
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(ExperienceValidation.updateExperienceZodSchema),
  ExperienceController.updateExperience,
);

// Delete experience
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  ExperienceController.deleteExperience,
);

export const ExperienceRouter: Router = router;
