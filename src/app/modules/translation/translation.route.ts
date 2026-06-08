import express, { Router } from "express";
import { TranslationController } from "./translation.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { TranslationValidation } from "./translation.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// ─── Public ───

// Get all translations for a locale as a flat key-value map
// e.g. GET /translations/en  →  { "hero.title": "Hello", ... }
router.get("/:locale", TranslationController.getTranslationsByLocale);

// Get a single translation by key and locale
// e.g. GET /translations/en/hero.title
router.get("/:locale/:key", TranslationController.getTranslationByKeyAndLocale);

// ─── Admin ───

// Get all translations across all locales
router.get(
  "/admin/all",
  auth(UserRole.ADMIN),
  TranslationController.getAllTranslations,
);

// Get a single translation by ID
router.get(
  "/admin/:translationId",
  auth(UserRole.ADMIN),
  TranslationController.getTranslationById,
);

// Create a single translation entry
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(TranslationValidation.createTranslationZodSchema),
  TranslationController.createTranslation,
);

// Bulk upsert translations
router.post(
  "/upsert",
  auth(UserRole.ADMIN),
  validateRequest(TranslationValidation.upsertTranslationsZodSchema),
  TranslationController.upsertTranslations,
);

// Update a translation's value by ID
router.put(
  "/:translationId",
  auth(UserRole.ADMIN),
  validateRequest(TranslationValidation.updateTranslationZodSchema),
  TranslationController.updateTranslation,
);

// Delete all translations for a locale
router.delete(
  "/locale/:locale",
  auth(UserRole.ADMIN),
  TranslationController.deleteTranslationsByLocale,
);

// Delete a single translation by ID
router.delete(
  "/:translationId",
  auth(UserRole.ADMIN),
  TranslationController.deleteTranslation,
);

export const TranslationRouter: Router = router;
