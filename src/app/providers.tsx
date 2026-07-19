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
          gutter={12}
          containerStyle={{
            top: 16,
            right: 16,
          }}
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: 14,
              background: "var(--toast-bg)",
              color: "var(--toast-color)",
              fontSize: "14px",
              fontWeight: 500,
              padding: "14px 18px",
              border: "1px solid var(--toast-border)",
              boxShadow: "var(--toast-shadow)",
              maxWidth: "400px",
              lineHeight: 1.5,
            },
            success: {
              style: {
                borderLeft: "4px solid var(--toast-success-border)",
                background: "var(--toast-success-bg)",
                color: "var(--toast-success-color)",
              },
              iconTheme: { primary: "#22C55E", secondary: "transparent" },
            },
            error: {
              style: {
                borderLeft: "4px solid var(--toast-error-border)",
                background: "var(--toast-error-bg)",
                color: "var(--toast-error-color)",
              },
              iconTheme: { primary: "#EF4444", secondary: "transparent" },
            },
            loading: {
              style: {
                borderLeft: "4px solid var(--toast-loading-border)",
                background: "var(--toast-loading-bg)",
                color: "var(--toast-loading-color)",
              },
            },
          }}
        />
      </ThemeProvider>
    </QueryProvider>
  );
}
