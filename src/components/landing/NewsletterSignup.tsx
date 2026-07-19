"use client";

import { useState, useCallback } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, SendHorizonal, Loader2, CheckCircle2 } from "lucide-react";

const newsletterSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      const result = newsletterSchema.safeParse({ email });
      if (!result.success) {
        setError(result.error.issues[0]?.message || "Invalid email");
        return;
      }

      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      setIsLoading(false);
      setIsSuccess(true);
      toast.success("You've been subscribed to MediMind health alerts!", {
        style: {
          borderRadius: "var(--radius-button)",
          background: "var(--toast-success-bg)",
          color: "var(--toast-success-color)",
          border: "1px solid var(--toast-success-border)",
        },
        iconTheme: {
          primary: "var(--toast-success-color)",
          secondary: "var(--toast-success-bg)",
        },
      });

      setEmail("");
      setTimeout(() => setIsSuccess(false), 4000);
    },
    [email],
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
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 dark:from-[var(--color-primary)]/10 dark:to-[var(--color-secondary)]/5 backdrop-blur-sm px-6 py-10 sm:px-12 sm:py-14">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--color-secondary)]/5 dark:bg-[var(--color-secondary)]/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Get Weekly Health Alerts & Insights
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 dark:text-slate-400">
              Subscribe to receive AI-powered health tips, medication reminders,
              and the latest medical research summaries directly to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col sm:flex-row items-center gap-3"
              noValidate
            >
              <div className="relative w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your email address"
                  disabled={isLoading || isSuccess}
                  aria-label="Email address"
                  aria-invalid={!!error}
                  className={`w-full rounded-[var(--radius-button)] border ${
                    error
                      ? "border-red-300 dark:border-red-700 focus:border-red-400 focus:ring-red-300/20"
                      : "border-slate-200 dark:border-slate-700 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-secondary)] focus:ring-[var(--color-primary)]/20 dark:focus:ring-[var(--color-secondary)]/20"
                  } bg-white dark:bg-slate-800 pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:ring-1 transition-all duration-200 disabled:opacity-50`}
                />
              </div>
              <motion.button
                type="submit"
                disabled={isLoading || isSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex w-full sm:w-auto shrink-0 items-center justify-center gap-2 rounded-[var(--radius-button)] bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 dark:shadow-primary/10 transition-all duration-200 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Subscribing...</>
                ) : isSuccess ? (
                  <><CheckCircle2 className="h-4 w-4" /> Subscribed</>
                ) : (
                  <><SendHorizonal className="h-4 w-4" /> Subscribe</>
                )}
              </motion.button>
            </form>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-red-500 dark:text-red-400"
              >
                {error}
              </motion.p>
            )}

            <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-500">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
