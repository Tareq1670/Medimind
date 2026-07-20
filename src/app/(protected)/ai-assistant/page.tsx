"use client";

import { useChatSessions, useChatMessages, useCreateChatSession, type ChatMessage } from "@/hooks/useChatSessions";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";
import { getJwtToken } from "@/lib/api";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1`;

interface DisplayMessage {
  key: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  suggestedFollowUps?: string[];
}

interface Session {
  _id: string;
  sessionTitle?: string;
  title?: string;
  updatedAt: string;
  createdAt: string;
}

const QUICK_STARTS = [
  "What are the common symptoms of diabetes?",
  "How does paracetamol work?",
  "What should I do for a persistent headache?",
  "Explain the difference between bacterial and viral infections",
];

export default function AIAssistantPage() {
  const { data: sessions, isLoading: sessionsLoading } = useChatSessions();
  const createSession = useCreateChatSession();
  const qc = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { data: messages } = useChatMessages(activeSessionId);
  const [input, setInput] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [ratedMessages, setRatedMessages] = useState<Record<string, "up" | "down">>({});
  const [localMessages, setLocalMessages] = useState<DisplayMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const streamedTextRef = useRef("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, followUps, localMessages]);

  const streamChat = useCallback(async (sessionId: string, message: string) => {
    const token = await getJwtToken();
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.message || `Chat request failed (${res.status})`);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";
    let newFollowUps: string[] = [];
    streamedTextRef.current = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "chunk") {
            streamedTextRef.current += data.content;
            setStreamingContent(streamedTextRef.current);
          } else if (data.type === "done") {
            newFollowUps = data.followUps || [];
          } else if (data.type === "error") {
            throw new Error(data.message);
          }
        } catch {
          // skip malformed events
        }
      }
    }

    return newFollowUps;
  }, []);

  const handleSend = async (messageText?: string) => {
    const message = messageText || input;
    if (!message.trim() || isStreaming) return;

    setInput("");
    setIsStreaming(true);
    setStreamingContent("");
    setFollowUps([]);

    try {
      let sid = activeSessionId;

      if (!sid) {
        const result = await createSession.mutateAsync();
        sid = (result as { _id: string })?._id || null;
        if (sid) setActiveSessionId(sid);
      }

      if (sid) {
        const newFollowUps = await streamChat(sid, message);

        const assistantMsg: DisplayMessage = {
          key: `local-${Date.now()}`,
          role: "assistant",
          content: streamedTextRef.current,
          createdAt: new Date().toISOString(),
          suggestedFollowUps: newFollowUps,
        };
        setLocalMessages((prev) => [...prev, assistantMsg]);
        setStreamingContent("");
        streamedTextRef.current = "";
        setFollowUps(newFollowUps);

        qc.invalidateQueries({ queryKey: ["chat-messages", sid] });
        qc.invalidateQueries({ queryKey: ["chat-sessions"] });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to get response";
      setStreamingContent("");
      streamedTextRef.current = "";
      const errorMsg: DisplayMessage = {
        key: `error-${Date.now()}`,
        role: "assistant",
        content: `Error: ${msg}`,
        createdAt: new Date().toISOString(),
      };
      setLocalMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages([]);
      setFollowUps([]);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRate = (messageId: string, rating: "up" | "down") => {
    setRatedMessages((prev) => ({ ...prev, [messageId]: rating }));
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "long" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const sessionList = (sessions as Session[] | undefined) ?? [];

  const displayMessages: DisplayMessage[] = messages && messages.length > 0
    ? (messages as ChatMessage[]).map((m) => ({
        key: m._id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
        suggestedFollowUps: m.suggestedFollowUps,
      }))
    : localMessages;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Session sidebar */}
      <div className={`${sidebarOpen ? "w-72" : "w-0"} transition-all duration-200 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shrink-0 flex flex-col`}>
        <div className="p-3 space-y-2">
          <button
            onClick={() => { createSession.mutate(); }}
            disabled={createSession.isPending}
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {createSession.isPending ? "Creating..." : "+ New Chat"}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
          {sessionsLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
            ))
          ) : sessionList.length > 0 ? (
            sessionList.map((s) => (
              <button
                key={s._id}
                onClick={() => { setActiveSessionId(s._id); setFollowUps([]); setLocalMessages([]); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  activeSessionId === s._id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span className="truncate block">{s.sessionTitle || s.title || "New Chat"}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(s.updatedAt || s.createdAt)}</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">No conversations yet</p>
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">MediMind AI Assistant</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-600 dark:text-green-400">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {!activeSessionId ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How can I help you today?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Ask me anything about your health, symptoms, medications, or medical reports.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md">
                {QUICK_STARTS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-left px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-primary/30 hover:text-primary transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {displayMessages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div key={m.key} className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
                    {!isUser && (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 mt-1 shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    )}
                    <div className="max-w-[75%]">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          isUser
                            ? "bg-primary text-white rounded-br-md"
                            : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-md"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                      <div className={`flex items-center gap-2 mt-1 ${isUser ? "justify-end" : "justify-start"}`}>
                        {m.createdAt && <span className="text-xs text-slate-400">{formatTime(m.createdAt)}</span>}
                        {!isUser && (
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleCopy(m.content, m.key)}
                              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
                              title="Copy message"
                            >
                              {copiedId === m.key ? (
                                <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                              )}
                            </button>
                            <button onClick={() => handleRate(m.key, "up")}
                              className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${ratedMessages[m.key] === "up" ? "text-green-500" : "text-slate-400"}`}
                              title="Helpful"
                            >
                              <svg className="w-3.5 h-3.5" fill={ratedMessages[m.key] === "up" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" /></svg>
                            </button>
                            <button onClick={() => handleRate(m.key, "down")}
                              className={`p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 ${ratedMessages[m.key] === "down" ? "text-red-500" : "text-slate-400"}`}
                              title="Not helpful"
                            >
                              <svg className="w-3.5 h-3.5" fill={ratedMessages[m.key] === "down" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3zm7-13h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" /></svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isStreaming && streamingContent && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 mt-1 shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="max-w-[75%] rounded-2xl rounded-bl-md px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    <p className="whitespace-pre-wrap">{streamingContent}</p>
                  </div>
                </div>
              )}

              {isStreaming && !streamingContent && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 mt-1 shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              {!isStreaming && followUps.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-10">
                  {followUps.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:border-primary/30 hover:text-primary transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your health..."
              disabled={isStreaming}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isStreaming ? (
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Thinking...</span>
                </span>
              ) : (
                "Send"
              )}
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            This AI assistant provides informational responses only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
