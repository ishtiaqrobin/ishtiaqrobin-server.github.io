import express, { Router } from "express";
import { ExperienceController } from "./experience.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { ExperienceValidation } from "./experience.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { createMulterUpload } from "../../config/multer.config";

const experienceUpload = createMulterUpload("experiences");

const router = express.Router();

router.get("/", ExperienceController.getExperiences);

router.post(
  "/",
  auth(UserRole.ADMIN),
  experienceUpload.fields([{ name: "companyLogo", maxCount: 1 }]),
  validateRequest(ExperienceValidation.createExperienceZodSchema),
  ExperienceController.createExperience,
);

router.put(
  "/:id",
  auth(UserRole.ADMIN),
  experienceUpload.fields([{ name: "companyLogo", maxCount: 1 }]),
  validateRequest(ExperienceValidation.updateExperienceZodSchema),
  ExperienceController.updateExperience,
);

router.delete("/:id", auth(UserRole.ADMIN), ExperienceController.deleteExperience);

export const ExperienceRouter: Router = router;
