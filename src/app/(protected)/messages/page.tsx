"use client";

import { useState } from "react";
import { MessageSquareText, Search, User } from "@/lib/icon-map";
import { EmptyState } from "@/components/shared";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  unread: boolean;
}

const MOCK_MESSAGES: Message[] = [
  { id: "1", sender: "Sarah Rahman", content: "Doctor, I've been having persistent headaches...", timestamp: "2026-07-21T10:30:00", unread: true },
  { id: "2", sender: "Rahim Mia", content: "Thank you for the prescription update.", timestamp: "2026-07-20T14:15:00", unread: false },
  { id: "3", sender: "Fatima Begum", content: "Is the appointment time still confirmed?", timestamp: "2026-07-19T09:00:00", unread: false },
];

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = MOCK_MESSAGES.filter((m) =>
    m.sender.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-sm">
          <MessageSquareText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Communicate with your patients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card-standard p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search messages"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-teal-500"
            />
          </div>
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <EmptyState title="No messages found" />
            ) : (
              filtered.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => setSelected(msg.id)}
                  className={`w-full text-left p-3 rounded-xl transition-colors ${
                    selected === msg.id
                      ? "bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                      <User className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {msg.sender}
                        </span>
                        {msg.unread && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{msg.content}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 card-standard p-6 flex items-center justify-center min-h-[400px]">
          {selected ? (
            <div className="text-center text-slate-500 dark:text-slate-400">
              <MessageSquareText className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p>Message thread coming soon</p>
            </div>
          ) : (
            <div className="text-center text-slate-500 dark:text-slate-400">
              <MessageSquareText className="h-12 w-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-sm">Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
