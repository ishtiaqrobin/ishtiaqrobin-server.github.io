import { NextFunction, Request, Response } from "express";
import { ChatbotService } from "./chatbot.service";
import status from "http-status";

// ── Chat ──────────────────────────────────────────────────

// Send message (public)
const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
    const result = await ChatbotService.sendMessage(req.body, ipAddress);
    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ── AI Provider Config ────────────────────────────────────

// Get AI provider config (admin)
const getAiProviderConfig = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ChatbotService.getAiProviderConfig();
    res.status(200).json({
      success: true,
      message: "Retrieved AI provider config successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Upsert AI provider config (admin)
const upsertAiProviderConfig = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ChatbotService.upsertAiProviderConfig(req.body);
    res.status(200).json({
      success: true,
      message: "AI provider config updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ── Chatbot Config ────────────────────────────────────────

// Get chatbot config (admin)
const getChatbotConfig = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ChatbotService.getChatbotConfig();
    res.status(200).json({
      success: true,
      message: "Retrieved chatbot config successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Upsert chatbot config (admin)
const upsertChatbotConfig = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ChatbotService.upsertChatbotConfig(req.body);
    res.status(200).json({
      success: true,
      message: "Chatbot config updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ── Chatbot Logs ──────────────────────────────────────────
// DISABLED — ChatbotLog model আপাতত comment out করা schema এ।
// চালু করতে চাইলে: schema model uncomment → migrate → নিচের handler
// ও export uncomment + route গুলো uncomment।
//
// Get all logs (admin)
// const getChatbotLogs = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { sessionId } = req.query;
//     const result = await ChatbotService.getChatbotLogs(sessionId as string);
//     res.status(200).json({
//       success: true,
//       message: "Retrieved chatbot logs successfully",
//       data: result,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
//
// Delete logs (admin — specific session or all)
// const deleteChatbotLogs = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { sessionId } = req.query;
//     await ChatbotService.deleteChatbotLogs(sessionId as string);
//     res.status(200).json({
//       success: true,
//       message: sessionId
//         ? "Session logs deleted successfully"
//         : "All chatbot logs deleted successfully",
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const ChatbotController = {
  sendMessage,
  getAiProviderConfig,
  upsertAiProviderConfig,
  getChatbotConfig,
  upsertChatbotConfig,
  // getChatbotLogs,
  // deleteChatbotLogs,
};
