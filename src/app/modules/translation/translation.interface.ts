export type SupportedLocale = "en" | "bn";

export interface CreateTranslationInput {
  key: string;
  locale: SupportedLocale;
  value: string;
}

export interface UpdateTranslationInput {
  value: string;
}

// Bulk upsert: array of { key, locale, value }
export interface UpsertTranslationInput {
  key: string;
  locale: SupportedLocale;
  value: string;
}
