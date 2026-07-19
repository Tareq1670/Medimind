"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { QueryProvider } from "@/providers/QueryClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "var(--radius-card)",
              background: "var(--color-card-light)",
              color: "var(--color-neutral)",
            },
          }}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
