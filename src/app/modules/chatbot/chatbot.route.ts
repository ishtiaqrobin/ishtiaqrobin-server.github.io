import express, { Router } from "express";
import { ChatbotController } from "./chatbot.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { ChatbotValidation } from "./chatbot.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// ── Chat (Public) ───

// Send message
router.post(
  "/send",
  validateRequest(ChatbotValidation.sendMessageZodSchema),
  ChatbotController.sendMessage,
);

// ── AI Provider Config (Admin) ────

// Get AI provider config
router.get(
  "/ai-config",
  auth(UserRole.ADMIN),
  ChatbotController.getAiProviderConfig,
);

// Upsert AI provider config
router.post(
  "/ai-config",
  auth(UserRole.ADMIN),
  validateRequest(ChatbotValidation.createAiProviderConfigZodSchema),
  ChatbotController.upsertAiProviderConfig,
);

// Update AI provider config
router.put(
  "/ai-config",
  auth(UserRole.ADMIN),
  validateRequest(ChatbotValidation.updateAiProviderConfigZodSchema),
  ChatbotController.upsertAiProviderConfig,
);

// ── Chatbot Config (Admin) ───

// Get chatbot config
router.get("/config", auth(UserRole.ADMIN), ChatbotController.getChatbotConfig);

// Upsert chatbot config
router.post(
  "/config",
  auth(UserRole.ADMIN),
  validateRequest(ChatbotValidation.createChatbotConfigZodSchema),
  ChatbotController.upsertChatbotConfig,
);

// Update chatbot config
router.put(
  "/config",
  auth(UserRole.ADMIN),
  validateRequest(ChatbotValidation.updateChatbotConfigZodSchema),
  ChatbotController.upsertChatbotConfig,
);

// ── Chatbot Logs (Admin) ───
// DISABLED — ChatbotLog model schema এ comment out করা।
// চালু করতে চাইলে: schema model uncomment → migrate → controller/service
// এর related code uncomment → নিচের route গুলো uncomment।
//
// Get all logs (optional ?sessionId=xxx filter)
// router.get("/logs", auth(UserRole.ADMIN), ChatbotController.getChatbotLogs);
//
// Delete logs (optional ?sessionId=xxx, না দিলে সব delete)
// router.delete(
//   "/logs",
//   auth(UserRole.ADMIN),
//   ChatbotController.deleteChatbotLogs,
// );

export const ChatbotRouter: Router = router;
