"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, AlertTriangle, Lightbulb, Loader2 } from "@/lib/icon-map";

const sampleResponse = {
  caution:
    "Based on your symptoms, this could indicate a common viral respiratory infection. However, if symptoms persist beyond 48 hours or worsen, please consult a healthcare provider immediately.",
  recommendations: [
    "Rest and maintain adequate hydration",
    "Monitor your temperature every 6 hours",
    "Consider over-the-counter acetaminophen for fever",
    "Seek immediate care if you experience difficulty breathing",
  ],
  disclaimer:
    "This is an AI-generated preliminary assessment and does not constitute medical advice. Always consult a qualified healthcare professional.",
};

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-[var(--color-secondary)]"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function SymptomChecker() {
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setShowResponse(false);

    setTimeout(() => {
      setIsProcessing(false);
      setShowResponse(true);
    }, 2000);
  }, [input, isProcessing]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative py-12 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Try Our Virtual Assistant
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Describe your symptoms in plain language and see how MediMind&apos;s AI
            analyzes them in real time.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <div className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-4 sm:p-6">
            <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-700/50 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)]">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  MediMind AI Assistant
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  Online &bull; Instant response
                </p>
              </div>
            </div>

            <div className="min-h-[200px] py-4">
              {!showResponse && !isProcessing && (
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Bot className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Hello! I&apos;m MediMind AI. Describe your symptoms and I&apos;ll
                    provide a preliminary analysis. For example: &ldquo;I have a
                    headache, fever, and sore throat.&rdquo;
                  </div>
                </div>
              )}

              {isProcessing && (
                <div className="flex items-start gap-3 animate-fadeIn">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Bot className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3">
                    <TypingDots />
                  </div>
                </div>
              )}

              <AnimatePresence>
                {showResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/20">
                        <Bot className="h-3.5 w-3.5 text-[var(--color-secondary)]" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30 px-3.5 py-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Initial Caution
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-amber-800 dark:text-amber-200/90 leading-relaxed">
                            {sampleResponse.caution}
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/30 px-3.5 py-2.5">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            <Lightbulb className="h-3.5 w-3.5" />
                            Recommendations
                          </div>
                          <ul className="mt-1.5 space-y-1">
                            {sampleResponse.recommendations.map((rec) => (
                              <li
                                key={rec}
                                className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300"
                              >
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--color-secondary)]" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 italic leading-relaxed">
                          {sampleResponse.disclaimer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your symptoms..."
                disabled={isProcessing}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-[var(--color-primary)] dark:focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-primary)]/20 dark:focus:ring-[var(--color-secondary)]/20 transition-all duration-200 disabled:opacity-50"
                aria-label="Describe your symptoms"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || isProcessing}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send symptoms"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
