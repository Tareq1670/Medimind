"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeMap = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)} role="status" aria-live="polite">
      <div
        className={cn(
          "border-4 border-primary border-t-transparent rounded-full animate-spin",
          sizeMap[size]
        )}
      />
      {text && <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
