import { z } from "zod";
import { sanitizeText, sanitizeUrl } from "../../utils/sanitize";

// ── Reusable sanitized primitives ─────────────────────────
const optionalText = z
  .string()
  .optional()
  .transform((v) => (v === undefined ? undefined : sanitizeText(v)));

const optionalNullableUrl = z
  .string()
  .optional()
  .nullable()
  .transform((v) => (v === undefined || v === null ? v : sanitizeUrl(v)));

// ── AI Provider Config ────────────────────────────────────
const createAiProviderConfigZodSchema = z.object({
  provider: z.string("provider is required").transform((v) => sanitizeText(v)),
  // apiKey — never rendered to UI, but still strip HTML defensively
  apiKey: z.string("apiKey is required").transform((v) => sanitizeText(v)),
  model: z.string("model is required").transform((v) => sanitizeText(v)),
  endpoint: optionalNullableUrl,
  maxTokens: z.number().optional(),
  temperature: z.number().min(0).max(1).optional(),
  isEnabled: z.boolean().optional(),
});

const updateAiProviderConfigZodSchema =
  createAiProviderConfigZodSchema.partial();

// ── Chatbot Config ────────────────────────────────────────
const createChatbotConfigZodSchema = z.object({
  isEnabled: z.boolean().optional(),
  botName: optionalText,
  welcomeMsg: optionalText,
  // System prompt is fed to the LLM, not rendered as HTML.
  // Still strip HTML to keep prompts clean & predictable.

  systemPrompt: optionalText,

  // If you need to remove rate limit and use by .env file
  // so remove rateLimit and rateLimitWindow code
  // rateLimit: z.number().min(1).optional(),
  // rateLimitWindow: z.number().min(1).optional(),
});

const updateChatbotConfigZodSchema = createChatbotConfigZodSchema.partial();

// ── Send message (PUBLIC — highest risk surface) ──────────
const sendMessageZodSchema = z.object({
  message: z
    .string("message is required")
    .min(1, "message cannot be empty")
    .transform((v) => sanitizeText(v))
    .refine((v) => v.length > 0, "message cannot be empty after sanitization"),
  sessionId: z
    .string("sessionId is required")
    .transform((v) => sanitizeText(v)),
});

export const ChatbotValidation = {
  createAiProviderConfigZodSchema,
  updateAiProviderConfigZodSchema,
  createChatbotConfigZodSchema,
  updateChatbotConfigZodSchema,
  sendMessageZodSchema,
};
