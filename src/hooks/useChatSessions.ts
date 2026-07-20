import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import { useAuthSession } from "@/hooks/useAuthSession";
import toast from "react-hot-toast";

export interface ChatSession {
  _id: string;
  sessionTitle?: string;
  participants: string[];
  messages?: RawChatMessage[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RawChatMessage {
  senderId: string;
  content: string;
  timestamp?: string;
  createdAt?: string;
  suggestedFollowUps?: string[];
}

export interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  suggestedFollowUps?: string[];
}

export function useChatSessions() {
  return useQuery({
    queryKey: ["chat-sessions"],
    queryFn: async () => {
      const result = await get<{ data: ChatSession[] }>("/chat-sessions");
      return result.data ?? (Array.isArray(result) ? result : []);
    },
  });
}

export function useChatMessages(sessionId: string | null) {
  const { user } = useAuthSession();
  const userId = user?.id;

  return useQuery({
    queryKey: ["chat-messages", sessionId, userId],
    queryFn: async () => {
      if (!sessionId) return [];
      const result = await get<ChatSession>(`/chat-sessions/${sessionId}`);
      const rawMessages = result.messages ?? [];
      return rawMessages.map<ChatMessage>((m, index) => {
        const senderStr = String(m.senderId ?? "");
        return {
          _id: `${senderStr}-${m.timestamp || m.createdAt || index}`,
          role: userId && senderStr === String(userId) ? "user" : "assistant",
          content: m.content,
          createdAt: m.timestamp || m.createdAt || new Date().toISOString(),
          suggestedFollowUps: m.suggestedFollowUps,
        };
      });
    },
    enabled: !!sessionId,
  });
}

export function useCreateChatSession() {
  const qc = useQueryClient();
  const { user } = useAuthSession();
  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      return post("/chat-sessions", { participants: [user.id] });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-sessions"] });
    },
  });
}

export function useSendMessage(sessionId: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (content: string) => {
      if (!sessionId) throw new Error("No session");
      return post(`/chat-sessions/${sessionId}/messages`, { content });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat-messages", sessionId] });
    },
    onError: () => toast.error("Failed to send message"),
  });
}
