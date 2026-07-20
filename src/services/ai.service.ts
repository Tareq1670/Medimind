import { get, post } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants";
import type { ChatMessage, ChatSession, SymptomAnalysis, ReportAnalysis, AIRecommendation } from "@/types";

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const aiService = {
  getChatSessions: () =>
    get<{ data: ChatSession[] }>(API_ENDPOINTS.CHAT_SESSIONS),

  getChatMessages: (sessionId: string) =>
    get<{ data: ChatMessage[] }>(`${API_ENDPOINTS.CHAT_SESSIONS}/${sessionId}/messages`),

  createChatSession: (title?: string) =>
    post<ChatSession>(API_ENDPOINTS.CHAT_SESSIONS, { title: title || "New Chat" }),

  sendMessage: (sessionId: string, content: string) =>
    post<ChatMessage>(`${API_ENDPOINTS.CHAT_SESSIONS}/${sessionId}/messages`, { content }),

  analyzeSymptoms: (symptoms: string[], duration?: string) =>
    post<SymptomAnalysis>(API_ENDPOINTS.SYMPTOM_ANALYSES, { symptoms, duration }),

  analyzeReport: (formData: FormData) =>
    post<ReportAnalysis>(API_ENDPOINTS.REPORT_ANALYSES, formData),

  getRecommendations: (userId: string) =>
    get<{ data: AIRecommendation[] }>(`${API_ENDPOINTS.AI}/recommendations/${userId}`),

  chat: (message: string, sessionId?: string) =>
    post<{ message: string; sessionId: string; recommendations?: AIRecommendation[] }>(
      `${API_ENDPOINTS.AI}/chat`,
      { message, sessionId }
    ),
};
