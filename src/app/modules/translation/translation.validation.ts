import { z } from "zod";

const supportedLocale = z.string().refine((val) => ["en", "bn"].includes(val), {
  message: 'Locale must be "en" or "bn"',
});

const createTranslationZodSchema = z.object({
  key: z.string().min(1, "Key is required"),
  locale: supportedLocale,
  value: z.string().min(1, "Value is required"),
});

const updateTranslationZodSchema = z.object({
  value: z.string().min(1, "Value is required"),
});

// Bulk upsert: accepts an array of translation entries
const upsertTranslationsZodSchema = z.object({
  translations: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        locale: supportedLocale,
        value: z.string().min(1, "Value is required"),
      }),
    )
    .min(1, "At least one translation entry is required"),
});

export const TranslationValidation = {
  createTranslationZodSchema,
  updateTranslationZodSchema,
  upsertTranslationsZodSchema,
};
