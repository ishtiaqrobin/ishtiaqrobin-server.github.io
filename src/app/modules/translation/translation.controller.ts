import { NextFunction, Request, Response } from "express";
import { TranslationService } from "./translation.service";
import { SupportedLocale } from "./translation.interface";

// ─── Public ────────────────────────────────────────────────────

// Get all translations for a locale as a flat key-value map (public)
// GET /translations/:locale  →  { "hero.title": "Hello", ... }
const getTranslationsByLocale = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { locale } = req.params;
    const result = await TranslationService.getTranslationsByLocale(
      locale as SupportedLocale,
    );

    res.status(200).json({
      success: true,
      message: `Translations for locale "${locale}" retrieved successfully`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single translation by key and locale (public)
// GET /translations/:locale/:key
const getTranslationByKeyAndLocale = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { locale, key } = req.params;
    const result = await TranslationService.getTranslationByKeyAndLocale(
      key as string,
      locale as SupportedLocale,
    );

    res.status(200).json({
      success: true,
      message: "Translation retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Admin ─────────────────────────────────────────────────────

// Get all translations across all locales (admin)
const getAllTranslations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TranslationService.getAllTranslations();

    res.status(200).json({
      success: true,
      message: "All translations retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single translation by ID (admin)
const getTranslationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { translationId } = req.params;
    const result = await TranslationService.getTranslationById(
      translationId as string,
    );

    res.status(200).json({
      success: true,
      message: "Translation retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Create a single translation (admin)
const createTranslation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TranslationService.createTranslation(req.body);

    res.status(201).json({
      success: true,
      message: "Translation created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update a translation's value by ID (admin)
const updateTranslation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { translationId } = req.params;
    const result = await TranslationService.updateTranslation(
      translationId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Translation updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a translation by ID (admin)
const deleteTranslation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { translationId } = req.params;
    await TranslationService.deleteTranslation(translationId as string);

    res.status(200).json({
      success: true,
      message: "Translation deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

// Bulk upsert translations (admin)
const upsertTranslations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { translations } = req.body;
    const result = await TranslationService.upsertTranslations(translations);

    res.status(200).json({
      success: true,
      message: `${result.length} translation(s) upserted successfully`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete all translations for a locale (admin)
const deleteTranslationsByLocale = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { locale } = req.params;
    const result = await TranslationService.deleteTranslationsByLocale(
      locale as SupportedLocale,
    );

    res.status(200).json({
      success: true,
      message: `All "${locale}" translations deleted successfully`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const TranslationController = {
  getTranslationsByLocale,
  getTranslationByKeyAndLocale,
  getAllTranslations,
  getTranslationById,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  upsertTranslations,
  deleteTranslationsByLocale,
};
