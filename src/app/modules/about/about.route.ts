import express, { Router } from "express";
import { AboutController } from "./about.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { AboutValidation } from "./about.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { createMulterUpload } from "../../config/multer.config";

const aboutImageUpload = createMulterUpload("about");

const router = express.Router();

// Get about (singleton)
router.get("/", AboutController.getAbout);

// Create about (upsert)
router.post(
  "/",
  auth(UserRole.ADMIN),
  aboutImageUpload.fields([
    { name: "aboutMeImg", maxCount: 1 },
  ]),
  validateRequest(AboutValidation.createAboutZodSchema),
  AboutController.createAbout,
);

// Update about (singleton)
router.put(
  "/",
  auth(UserRole.ADMIN),
  aboutImageUpload.fields([
    { name: "aboutMeImg", maxCount: 1 },
  ]),
  validateRequest(AboutValidation.updateAboutZodSchema),
  AboutController.updateAbout,
);

export const AboutRouter: Router = router;
