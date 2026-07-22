"use client";

interface FieldErrorProps {
  message?: string;
}

export function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400" role="alert">
      {message}
    </p>
  );
}
