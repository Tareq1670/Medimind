"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Bot, User, X, Send, Loader2 } from "@/lib/icon-map";
import { getApiBase } from "@/lib/api";

const SUGGESTED_PROMPTS = [
  { label: "🩺 Symptom Check", text: "I have a headache and fever for 2 days. What could it be?" },
  { label: "💊 Medication Info", text: "What are the side effects of Ibuprofen?" },
  { label: "🏥 When to See a Doctor", text: "When should I see a doctor for chest pain?" },
  { label: "🍎 Home Remedies", text: "What are natural remedies for sore throat?" },
];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

const WELCOME_MSG: ChatMessage = {
  role: "assistant",
  content: `Hello! I'm **MediMind AI**, your personal health assistant.

I can help you with:
- **Symptom analysis** — describe what you're feeling
- **Medication info** — side effects, interactions, dosage guidance
- **Health conditions** — causes, treatments, prevention
- **When to see a doctor** — urgency assessment
- **Platform navigation** — find the right feature for you

How can I assist you today?`,
  timestamp: Date.now(),
};

function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("---")) {
      elements.push(<hr key={key++} className="my-2 border-slate-200 dark:border-slate-700" />);
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(<h1 key={key++} className="text-base font-bold mt-2 mb-1">{renderInline(line.slice(2))}</h1>);
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-sm font-bold mt-2 mb-1">{renderInline(line.slice(3))}</h2>);
      continue;
    }

    if (line.match(/^[-*] /)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(
          <li key={key++} className="ml-4 list-disc text-inherit">
            {renderInline(lines[i].replace(/^[-*] /, ""))}
          </li>
        );
        i++;
      }
      i--;
      elements.push(<ul key={key++} className="my-1 space-y-0.5">{items}</ul>);
      continue;
    }

    if (line.match(/^\d+\. /)) {
      const items: React.ReactNode[] = [];
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(
          <li key={key++} className="ml-4 list-decimal text-inherit">
            {renderInline(lines[i].replace(/^\d+\. /, ""))}
          </li>
        );
        i++;
      }
      i--;
      elements.push(<ol key={key++} className="my-1 space-y-0.5">{items}</ol>);
      continue;
    }

    if (line.trim() === "") {
      elements.push(<div key={key++} className="h-1.5" />);
      continue;
    }

    elements.push(
      <p key={key++} className="leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }

  return elements;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)|`(.+?)`)/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    if (match[2]) {
      parts.push(<strong key={key++} className="font-semibold">{match[2]}</strong>);
    } else if (match[3] && match[4]) {
      parts.push(
        <Link
          key={key++}
          href={match[4]}
          className="text-primary font-medium underline underline-offset-2 decoration-primary/30 hover:decoration-primary transition-colors"
        >
          {match[3]}
        </Link>
      );
    } else if (match[5]) {
      parts.push(
        <code key={key++} className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
          {match[5]}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
}

function formatTime(ts?: number): string {
  if (!ts) return "";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MSG]);
  const [streamingContent, setStreamingContent] = useState("");
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, streamingContent, isOpen, isStreaming, scrollToBottom]);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleSendMessage = useCallback(async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isStreaming) return;

    setInput("");
    setIsStreaming(true);
    setStreamingContent("");
    setFollowUps([]);

    const userMsg: ChatMessage = { role: "user", content: query, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    const history = [...messages, userMsg].slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const abort = new AbortController();
    abortRef.current = abort;

    let accumulated = "";
    let newFollowUps: string[] = [];

    try {
      const res = await fetch(`${getApiBase()}/ai/public-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query, history }),
        signal: abort.signal,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.message || `Chat request failed (${res.status})`);
      }

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
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(trimmed.slice(6));
            if (data.type === "chunk" && typeof data.content === "string") {
              accumulated += data.content;
              setStreamingContent(accumulated);
            } else if (data.type === "done") {
              newFollowUps = Array.isArray(data.followUps) ? data.followUps : [];
            } else if (data.type === "error") {
              throw new Error(data.message || "AI service error");
            }
          } catch (parseErr) {
            if (parseErr instanceof Error && parseErr.message !== "Unexpected end of JSON input") {
              if (trimmed.startsWith("data: ")) {
                console.warn("[chat] Malformed SSE event:", trimmed);
              }
            }
          }
        }
      }

      if (accumulated) {
        setMessages((prev) => [...prev, { role: "assistant", content: accumulated, timestamp: Date.now() }]);
      }
      setFollowUps(newFollowUps);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Failed to get response";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `I apologize, but I'm having trouble connecting right now. ${msg}. Please try again in a moment.`, timestamp: Date.now() },
      ]);
    } finally {
      setStreamingContent("");
      setIsStreaming(false);
      abortRef.current = null;
    }
  }, [input, isStreaming, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleClearChat = () => {
    abortRef.current?.abort();
    setMessages([WELCOME_MSG]);
    setStreamingContent("");
    setFollowUps([]);
    setIsStreaming(false);
  };

  const handleCopyMessage = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary to-primary/90 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative p-2 bg-white/20 rounded-xl">
                <Bot className="w-6 h-6" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base leading-tight">MediMind AI</h3>
                <p className="text-[11px] text-white/70 mt-0.5">Health Assistant · Online</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                title="Clear chat"
                aria-label="Clear chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => {
                  abortRef.current?.abort();
                  setIsOpen(false);
                }}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={`msg-${idx}-${msg.role}`}
                className={`group/msg flex items-start gap-2.5 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium ${
                    msg.role === "user"
                      ? "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className="max-w-[80%] flex flex-col gap-1">
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="space-y-1.5">{renderMarkdown(msg.content)}</div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {msg.role === "assistant" && idx > 0 && (
                      <button
                        onClick={() => handleCopyMessage(msg.content, idx)}
                        className="opacity-0 group-hover/msg:opacity-100 transition-opacity hover:text-primary"
                        title="Copy message"
                      >
                        {copiedIdx === idx ? (
                          <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming bubble */}
            {isStreaming && streamingContent && (
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="max-w-[80%] p-3 rounded-2xl rounded-tl-none text-sm leading-relaxed bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  <div className="space-y-1.5">{renderMarkdown(streamingContent)}</div>
                </div>
              </div>
            )}

            {/* Thinking indicator */}
            {isStreaming && !streamingContent && (
              <div className="flex items-center gap-2.5 pl-0.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/10 text-primary">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex gap-1 px-3 py-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up chips */}
          {followUps.length > 0 && !isStreaming && (
            <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700 overflow-x-auto flex gap-2 shrink-0 ">
              {followUps.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={isStreaming}
                  className="whitespace-nowrap px-3 py-1.5 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 text-primary border border-primary/20 rounded-full text-xs font-medium transition-all duration-200 shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Default suggestions */}
          {followUps.length === 0 && !isStreaming && messages.length <= 1 && (
            <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-700 overflow-x-auto flex gap-2 shrink-0 ">
              {SUGGESTED_PROMPTS.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(item.text)}
                  disabled={isStreaming}
                  className="whitespace-nowrap px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-full text-xs transition-all duration-200 shrink-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms or ask a health question..."
              disabled={isStreaming}
              className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              className="bg-primary hover:bg-primary/90 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white disabled:text-slate-500 p-2.5 rounded-xl transition-all duration-200 shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center px-3 pb-2 shrink-0">
            For informational purposes only. Always consult a healthcare professional.
          </p>
        </div>
      )}
    </div>
  );
}
