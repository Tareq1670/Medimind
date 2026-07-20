import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api";
import toast from "react-hot-toast";

interface ChatSession {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
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
  return useQuery({
    queryKey: ["chat-messages", sessionId],
    queryFn: async () => {
      if (!sessionId) return [];
      const result = await get<{ data: ChatMessage[] }>(`/chat-sessions/${sessionId}/messages`);
      return result.data ?? (Array.isArray(result) ? result : []);
    },
    enabled: !!sessionId,
  });
}

export function useCreateChatSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (title?: string) => post("/chat-sessions", { title: title || "New Chat" }),
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
