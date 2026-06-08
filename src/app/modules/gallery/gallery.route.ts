import express, { Router } from "express";
import { GalleryController } from "./gallery.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { GalleryValidation } from "./gallery.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { createMulterUpload } from "../../config/multer.config";

const galleryImageUpload = createMulterUpload("galleries");

const router = express.Router();

// Get all galleries
router.get("/", GalleryController.getGalleries);

// Get single gallery
router.get("/:id", GalleryController.getGalleryById);

// Create gallery
router.post(
  "/",
  auth(UserRole.ADMIN),
  galleryImageUpload.single("image"),
  validateRequest(GalleryValidation.createGalleryZodSchema),
  GalleryController.createGallery,
);

// Update gallery
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  galleryImageUpload.single("image"),
  validateRequest(GalleryValidation.updateGalleryZodSchema),
  GalleryController.updateGallery,
);

// Delete gallery
router.delete("/:id", auth(UserRole.ADMIN), GalleryController.deleteGallery);

export const GalleryRouter: Router = router;
