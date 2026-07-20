"use client";

import { useChatSessions, useChatMessages, useCreateChatSession } from "@/hooks/useChatSessions";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1`;

export default function AIAssistantPage() {
  const { data: sessions, isLoading: sessionsLoading } = useChatSessions();
  const createSession = useCreateChatSession();
  const qc = useQueryClient();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const { data: messages, isLoading: messagesLoading } = useChatMessages(activeSessionId);
  const [input, setInput] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const streamChat = useCallback(async (sessionId: string, message: string) => {
    const cookie = document.cookie.match(/(?:^|;\s*)better-auth\.session_token=([^;]*)/)?.[1];
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { Authorization: `Bearer ${cookie}` } : {}),
      },
      body: JSON.stringify({ message, sessionId }),
    });

    const reader = res.body?.getReader();
    if (!reader) throw new Error("No response body");

    const decoder = new TextDecoder();
    let buffer = "";

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
            setStreamingContent((prev) => prev + data.content);
          } else if (data.type === "done") {
            return;
          } else if (data.type === "error") {
            throw new Error(data.message);
          }
        } catch {
          // skip malformed events
        }
      }
    }
  }, []);

  const handleNewChat = async () => {
    const result = await createSession.mutateAsync(undefined);
    const newSessionId = ((result as { data?: { _id: string }; _id?: string })?.data?._id || (result as { _id?: string })._id) ?? null;
    if (newSessionId) setActiveSessionId(newSessionId);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const message = input;
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      let sid = activeSessionId;

      if (!sid) {
        const result = await createSession.mutateAsync(message.slice(0, 40));
        sid = ((result as { data?: { _id: string }; _id?: string })?.data?._id || (result as { _id?: string })._id) ?? null;
        if (sid) setActiveSessionId(sid);
      }

      if (sid) {
        await streamChat(sid, message);
        qc.invalidateQueries({ queryKey: ["chat-messages", sid] });
      }
    } catch {
      // error already handled via stream
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Session sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-200 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shrink-0`}>
        <div className="p-3 space-y-2">
          <button
            onClick={handleNewChat}
            disabled={createSession.isPending}
            className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {createSession.isPending ? "Creating..." : "+ New Chat"}
          </button>
          <div className="space-y-1 mt-3">
            {sessionsLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="h-10 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))
            ) : sessions && sessions.length > 0 ? (
              sessions.map((s) => (
                <button
                  key={s._id}
                  onClick={() => setActiveSessionId(s._id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSessionId === s._id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate block">{s.title}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No conversations yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">AI Health Assistant</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {!activeSessionId ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI Health Assistant</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Ask me anything about your health, symptoms, medications, or medical reports.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {[
                  "What are symptoms of flu?",
                  "How does aspirin work?",
                  "Tips for better sleep",
                  "Explain my blood test",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : messagesLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {messages?.map((m) => (
                <div key={m._id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                      m.role === "user"
                        ? "bg-primary text-white"
                        : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.content}</p>
                    <p className={`text-xs mt-1 ${m.role === "user" ? "text-white/60" : "text-slate-400"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {streamingContent && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-2xl px-4 py-3 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                    <p className="whitespace-pre-wrap">{streamingContent}</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question..."
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isStreaming ? (
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Streaming
                </span>
              ) : (
                "Send"
              )}
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2">
            This AI assistant provides informational responses only. Always consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
