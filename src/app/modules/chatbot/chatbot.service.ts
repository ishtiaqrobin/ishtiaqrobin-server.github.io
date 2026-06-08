import { prisma } from "../../lib/prisma";
import {
  CreateAiProviderConfigInput,
  UpdateAiProviderConfigInput,
  CreateChatbotConfigInput,
  UpdateChatbotConfigInput,
  SendMessageInput,
  ConversationMessage,
} from "./chatbot.interface";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { env } from "../../config/env";

// ── Rate Limit Store (in-memory) ──────────────────────────
// Key: IP address, Value: { count, windowStart }
const rateLimitStore = new Map<
  string,
  { count: number; windowStart: number }
>();

const checkRateLimit = (
  ip: string,
  rateLimit: number,
  rateLimitWindow: number,
): void => {
  const now = Date.now();
  const windowMs = rateLimitWindow * 1000;
  const record = rateLimitStore.get(ip);

  if (!record || now - record.windowStart > windowMs) {
    // নতুন window শুরু
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return;
  }

  if (record.count >= rateLimit) {
    const retryAfter = Math.ceil(
      (windowMs - (now - record.windowStart)) / 1000,
    );
    throw new AppError(
      status.TOO_MANY_REQUESTS,
      `Too many requests. Please wait ${retryAfter} seconds.`,
    );
  }

  record.count += 1;
};

// ── DB Context Builder ────────────────────────────────────
// DB থেকে সব data এনে একটা readable context string বানায়
const buildContextFromDB = async (): Promise<string> => {
  const [about, skills, experiences, projects, services, settings] =
    await Promise.all([
      prisma.about.findUnique({ where: { id: "singleton" } }),
      prisma.skill.findMany({
        where: { category: { isPublished: true } },
        include: { category: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.experience.findMany({
        where: { isPublished: true },
        orderBy: { startDate: "desc" },
      }),
      prisma.project.findMany({
        where: { isPublished: true, isFeatured: true },
        include: { category: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.service.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.settings.findUnique({ where: { id: "singleton" } }),
    ]);

  const lines: string[] = [];

  // About
  if (about) {
    if (about.title) lines.push(`Name: ${about.title}`);
    if (about.subtitle) lines.push(`Role: ${about.subtitle}`);
    if (about.description) lines.push(`About: ${about.description}`);
  }

  // Contact & Social
  if (settings) {
    if (settings.contactEmail) lines.push(`Email: ${settings.contactEmail}`);
    if (settings.contactPhone) lines.push(`Phone: ${settings.contactPhone}`);
    if (settings.githubUrl) lines.push(`GitHub: ${settings.githubUrl}`);
    if (settings.linkedinUrl) lines.push(`LinkedIn: ${settings.linkedinUrl}`);
    if (settings.availability)
      lines.push(`Availability: ${settings.availability}`);
  }

  // Skills
  if (skills.length) {
    const grouped = skills.reduce<Record<string, string[]>>((acc, skill) => {
      const cat = skill.category.name;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(`${skill.name} (${skill.level})`);
      return acc;
    }, {});
    lines.push("\nSkills:");
    Object.entries(grouped).forEach(([cat, list]) => {
      lines.push(`  ${cat}: ${list.join(", ")}`);
    });
  }

  // Experience
  if (experiences.length) {
    lines.push("\nWork Experience:");
    experiences.forEach((exp) => {
      const end = exp.endDate ? exp.endDate.getFullYear() : "Present";
      lines.push(
        `  - ${exp.title} at ${exp.company} (${exp.startDate.getFullYear()}–${end})`,
      );
      if (exp.description) lines.push(`    ${exp.description}`);
    });
  }

  // Featured Projects
  if (projects.length) {
    lines.push("\nFeatured Projects:");
    projects.forEach((proj) => {
      lines.push(`  - ${proj.title} [${proj.category.name}]`);
      lines.push(`    ${proj.description}`);
      if (proj.liveUrl) lines.push(`    Live: ${proj.liveUrl}`);
      if (proj.githubUrl) lines.push(`    GitHub: ${proj.githubUrl}`);
    });
  }

  // Services
  if (services.length) {
    lines.push("\nServices Offered:");
    services.forEach((svc) => {
      lines.push(
        `  - ${svc.name}${svc.description ? `: ${svc.description}` : ""}`,
      );
    });
  }

  return lines.join("\n");
};

// ── AI API Caller ─────────────────────────────────────────
// Provider config অনুযায়ী সঠিক API call করে
const callAiApi = async (
  providerConfig: {
    provider: string;
    apiKey: string;
    model: string;
    endpoint: string | null;
    maxTokens: number;
    temperature: number;
  },
  systemPrompt: string,
  history: ConversationMessage[],
  userMessage: string,
): Promise<string> => {
  const { provider, apiKey, model, endpoint, maxTokens, temperature } =
    providerConfig;

  // ── Gemini ──
  if (provider === "gemini") {
    // endpoint দেওয়া থাকলে base URL হিসেবে treat করো।
    // /v1beta/models পর্যন্ত যেকোনো endpoint accept করবে।
    // তারপর /${model}:generateContent?key= automatically append হবে।
    const geminiBase = (
      endpoint || "https://generativelanguage.googleapis.com/v1beta/models"
    ).replace(/\/$/, ""); // trailing slash remove
    // endpoint এ already model name থাকলে সেটা strip করো
    const geminiRoot = geminiBase.replace(new RegExp(`\/${model}.*$`), "");
    const url = `${geminiRoot}/${model}:generateContent?key=${apiKey}`;

    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [...history, { role: "user", parts: [{ text: userMessage }] }],
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature,
      },
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new AppError(
        status.BAD_GATEWAY,
        err?.error?.message || "Gemini API error",
      );
    }

    const data = await res.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response."
    );
  }

  // ── OpenAI compatible (openai / custom) ──
  if (provider === "openai" || provider === "custom") {
    const url = endpoint || "https://api.openai.com/v1/chat/completions";

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((h) => ({
        role: h.role === "model" ? "assistant" : "user",
        content: h.parts[0].text,
      })),
      { role: "user", content: userMessage },
    ];

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new AppError(
        status.BAD_GATEWAY,
        err?.error?.message || "OpenAI API error",
      );
    }

    const data = await res.json();
    return (
      data.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response."
    );
  }

  throw new AppError(status.BAD_REQUEST, `Unsupported provider: ${provider}`);
};

// ── Main Chat Function ────────────────────────────────────
const sendMessage = async (payload: SendMessageInput, ipAddress: string) => {
  const { message, sessionId } = payload;

  // 1. Config fetch
  const [chatbotConfig, aiConfig] = await Promise.all([
    prisma.chatbotConfig.findUnique({ where: { id: "singleton" } }),
    prisma.aiProviderConfig.findUnique({ where: { id: "singleton" } }),
  ]);

  if (!chatbotConfig?.isEnabled) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "Chatbot is currently disabled.",
    );
  }

  if (!aiConfig?.isEnabled || !aiConfig?.apiKey) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "AI provider is not configured.",
    );
  }

  // 2. Rate limit check
  checkRateLimit(
    ipAddress,
    env.CHATBOT.RATE_LIMIT,
    env.CHATBOT.RATE_LIMIT_WINDOW,
    // chatbotConfig.rateLimit,
    // chatbotConfig.rateLimitWindow,
  );

  // 3. DB context build
  const dbContext = await buildContextFromDB();

  // 4. Final system prompt = DB context + admin custom prompt
  const systemPrompt = [
    "You are a helpful assistant on a personal portfolio website.",
    "Answer questions about the portfolio owner using the context below.",
    "Be concise, friendly, and professional.",
    "If asked something not in the context, say you don't have that information.",
    "\n--- CONTEXT ---\n",
    dbContext,
    chatbotConfig.systemPrompt
      ? `\n--- ADDITIONAL INFO ---\n${chatbotConfig.systemPrompt}`
      : "",
  ].join("\n");

  // 5. Conversation history — DISABLED (ChatbotLog model commented out)
  //    আপাতত prior context ছাড়াই reply দিচ্ছি। চালু করতে চাইলে
  //    chatbot.prisma এ ChatbotLog uncomment করো ও নিচের block uncomment করো।
  //
  // const recentLogs = await prisma.chatbotLog.findMany({
  //   where: { sessionId },
  //   orderBy: { createdAt: "asc" },
  //   take: 10,
  // });
  //
  // const history: ConversationMessage[] = recentLogs.map((log) => ({
  //   role: log.role === "user" ? "user" : "model",
  //   parts: [{ text: log.message }],
  // }));
  const history: ConversationMessage[] = [];

  // 6. AI API call
  const aiResponse = await callAiApi(aiConfig, systemPrompt, history, message);

  // 7. Save to DB — DISABLED (ChatbotLog model commented out)
  //    চালু করতে চাইলে ChatbotLog model uncomment + এই block uncomment করো।
  //
  // await prisma.chatbotLog.createMany({
  //   data: [
  //     { sessionId, role: "user", message, ipAddress },
  //     { sessionId, role: "assistant", message: aiResponse, ipAddress },
  //   ],
  // });
  void ipAddress; // currently unused — kept for future logging

  return {
    reply: aiResponse,
    sessionId,
    botName: chatbotConfig.botName,
  };
};

// ── AI Provider Config CRUD ───────────────────────────────

const upsertAiProviderConfig = async (payload: CreateAiProviderConfigInput) => {
  const result = await prisma.aiProviderConfig.upsert({
    where: { id: "singleton" },
    update: payload as any,
    create: { id: "singleton", ...payload } as any,
  });
  return result;
};

const getAiProviderConfig = async () => {
  const result = await prisma.aiProviderConfig.findUnique({
    where: { id: "singleton" },
  });
  return result;
};

// ── Chatbot Config CRUD ───────────────────────────────────

const upsertChatbotConfig = async (payload: CreateChatbotConfigInput) => {
  const result = await prisma.chatbotConfig.upsert({
    where: { id: "singleton" },
    update: payload as any,
    create: { id: "singleton", ...payload } as any,
  });
  return result;
};

const getChatbotConfig = async () => {
  const result = await prisma.chatbotConfig.findUnique({
    where: { id: "singleton" },
  });
  return result;
};

// ── Chatbot Logs ──────────────────────────────────────────
// DISABLED — ChatbotLog model আপাতত prisma schema এ comment out করা।
// চালু করতে চাইলে: schema এ model uncomment → prisma migrate → নিচের
// function গুলো ও export uncomment + chatbot.route.ts এ route গুলো uncomment।
//
// const getChatbotLogs = async (sessionId?: string) => {
//   const result = await prisma.chatbotLog.findMany({
//     where: { ...(sessionId && { sessionId }) },
//     orderBy: { createdAt: "desc" },
//   });
//   return result;
// };
//
// const deleteChatbotLogs = async (sessionId?: string) => {
//   await prisma.chatbotLog.deleteMany({
//     where: { ...(sessionId && { sessionId }) },
//   });
// };

export const ChatbotService = {
  sendMessage,
  upsertAiProviderConfig,
  getAiProviderConfig,
  upsertChatbotConfig,
  getChatbotConfig,
  // getChatbotLogs,
  // deleteChatbotLogs,
};
