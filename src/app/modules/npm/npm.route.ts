import express, { Router } from "express";
import { NpmController } from "./npm.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { NpmValidation } from "./npm.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Get all published packages (public)
router.get("/", NpmController.getAllNpmPackages);

// Get all packages including unpublished (admin)
router.get(
  "/admin",
  auth(UserRole.ADMIN),
  NpmController.getAllNpmPackagesAdmin,
);

// Get a single package by ID (admin)
router.get(
  "/:packageId",
  auth(UserRole.ADMIN),
  NpmController.getNpmPackageById,
);

// Sync a package's stats from the npm API (admin)
router.post("/sync", auth(UserRole.ADMIN), NpmController.syncNpmPackage);

// Create a package (admin)
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(NpmValidation.createNpmPackageZodSchema),
  NpmController.createNpmPackage,
);

// Update a package (admin)
router.put(
  "/:packageId",
  auth(UserRole.ADMIN),
  validateRequest(NpmValidation.updateNpmPackageZodSchema),
  NpmController.updateNpmPackage,
);

// Delete a package (admin)
router.delete(
  "/:packageId",
  auth(UserRole.ADMIN),
  NpmController.deleteNpmPackage,
);

export const NpmRouter: Router = router;
