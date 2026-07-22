import { get, post } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants";
import type { ChatMessage, ChatSession, ReportAnalysis, AIRecommendation } from "@/types";

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

  analyzeSymptoms: (
    reportedSymptoms: string[],
    duration?: string,
    severity?: string,
    additionalInfo?: string
  ) =>
    post<{
      urgencyLevel: string;
      urgencyExplanation: string;
      possibleConditions: { name: string; probability: string; description: string; commonIn: string }[];
      recommendations: string[];
      warningSignsToWatch: string[];
      shouldSeeDoctor: boolean;
      doctorType: string;
      lifestyleAdvice: string[];
      disclaimer: string;
    }>(`${API_ENDPOINTS.AI}/symptom-analysis`, {
      reportedSymptoms,
      duration,
      severity,
      additionalInfo,
    }),

  analyzeReport: (formData: FormData) =>
    post<ReportAnalysis>(API_ENDPOINTS.REPORT_ANALYSES, formData),

  getRecommendations: (userId: string) =>
    get<{ data: AIRecommendation[] }>(`${API_ENDPOINTS.AI}/recommendations/${userId}`),

};
