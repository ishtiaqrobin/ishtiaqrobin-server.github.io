import express, { Router } from "express";
import { SkillController } from "./skill.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { SkillValidation } from "./skill.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Get all skills
router.get("/", SkillController.getSkills);

// Create skill
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(SkillValidation.createSkillZodSchema),
  SkillController.createSkill,
);

// Update skill
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(SkillValidation.updateSkillZodSchema),
  SkillController.updateSkill,
);

// Delete skill
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  SkillController.deleteSkill,
);

export const SkillRouter: Router = router;
