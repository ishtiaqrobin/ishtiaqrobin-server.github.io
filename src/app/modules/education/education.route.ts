import express, { Router } from "express";
import { EducationController } from "./education.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { EducationValidation } from "./education.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Get all educations
router.get("/", EducationController.getEducations);

// Create education
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(EducationValidation.createEducationZodSchema),
  EducationController.createEducation,
);

// Update education
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(EducationValidation.updateEducationZodSchema),
  EducationController.updateEducation,
);

// Delete education
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  EducationController.deleteEducation,
);

export const EducationRouter: Router = router;
