import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CreateTranslationInput,
  SupportedLocale,
  UpdateTranslationInput,
  UpsertTranslationInput,
} from "./translation.interface";

// ─── Public ────────────────────────────────────────────────────

// Get all translations for a locale as a flat key-value map
// e.g. { "hero.title": "Hello", "nav.home": "Home" }
const getTranslationsByLocale = async (locale: SupportedLocale) => {
  const rows = await prisma.translation.findMany({
    where: { locale },
    select: { key: true, value: true },
    orderBy: { key: "asc" },
  });

  // Convert array to flat object for easy frontend consumption
  const result = rows.reduce<Record<string, string>>((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});

  return result;
};

// Get a single translation by key and locale
const getTranslationByKeyAndLocale = async (
  key: string,
  locale: SupportedLocale,
) => {
  const result = await prisma.translation.findUnique({
    where: { key_locale: { key, locale } },
  });

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Translation not found for key "${key}" and locale "${locale}"`,
    );
  }

  return result;
};

// ─── Admin ─────────────────────────────────────────────────────

// Get all translations (all locales, for admin management)
const getAllTranslations = async () => {
  const result = await prisma.translation.findMany({
    orderBy: [{ key: "asc" }, { locale: "asc" }],
  });

  return result;
};

// Get a single translation by ID
const getTranslationById = async (id: string) => {
  const result = await prisma.translation.findUnique({
    where: { id },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Translation not found");
  }

  return result;
};

// Create a single translation entry
const createTranslation = async (payload: CreateTranslationInput) => {
  const existing = await prisma.translation.findUnique({
    where: { key_locale: { key: payload.key, locale: payload.locale } },
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      `A translation already exists for key "${payload.key}" with locale "${payload.locale}". Use update or bulk upsert instead.`,
    );
  }

  const result = await prisma.translation.create({
    data: payload,
  });

  return result;
};

// Update a single translation by ID (only value can change)
const updateTranslation = async (
  id: string,
  payload: UpdateTranslationInput,
) => {
  await getTranslationById(id); // ensure it exists

  const result = await prisma.translation.update({
    where: { id },
    data: { value: payload.value },
  });

  return result;
};

// Delete a single translation by ID
const deleteTranslation = async (id: string) => {
  await getTranslationById(id); // ensure it exists

  await prisma.translation.delete({ where: { id } });
};

// Bulk upsert — create or update many translations at once
// Useful for seeding or importing a full locale file
const upsertTranslations = async (entries: UpsertTranslationInput[]) => {
  const results = await prisma.$transaction(
    entries.map(({ key, locale, value }) =>
      prisma.translation.upsert({
        where: { key_locale: { key, locale } },
        update: { value },
        create: { key, locale, value },
      }),
    ),
  );

  return results;
};

// Delete all translations for a specific locale (admin)
const deleteTranslationsByLocale = async (locale: SupportedLocale) => {
  const result = await prisma.translation.deleteMany({
    where: { locale },
  });

  return result;
};

export const TranslationService = {
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
