"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="rounded-full bg-red-50 p-4 dark:bg-red-950/30">
        <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Page Error</h2>
      <p className="max-w-md text-sm text-neutral">
        This page encountered an error. Please try again or navigate back to the homepage.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-slate-200 px-6 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
