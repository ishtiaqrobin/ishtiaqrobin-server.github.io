// AI Provider Config
export interface CreateAiProviderConfigInput {
  provider: string;
  apiKey: string;
  model: string;
  endpoint?: string;
  maxTokens?: number;
  temperature?: number;
  isEnabled?: boolean;
}

export type UpdateAiProviderConfigInput = Partial<CreateAiProviderConfigInput>;

// Chatbot Config
export interface CreateChatbotConfigInput {
  isEnabled?: boolean;
  botName?: string;
  welcomeMsg?: string;
  systemPrompt?: string;

  // If you need to remove rate limit and use by .env file
  // so remove rateLimit and rateLimitWindow code
  // rateLimit?: number;
  // rateLimitWindow?: number;
}

export type UpdateChatbotConfigInput = Partial<CreateChatbotConfigInput>;

// Chat message — visitor থেকে আসে
export interface SendMessageInput {
  message: string;
  sessionId: string; // frontend থেকে generate করা unique session id
}

// Gemini API conversation format
export interface ConversationMessage {
  role: "user" | "model";
  parts: [{ text: string }];
}
