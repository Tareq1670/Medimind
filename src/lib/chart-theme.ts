"use client";

import { useTheme } from "next-themes";

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return {
    gridColor: isDark ? "rgba(148,163,184,0.12)" : "#e2e8f0",
    tickColor: isDark ? "#64748b" : "#94a3b8",
    tooltipBg: isDark ? "#1e293b" : "#ffffff",
    tooltipBorder: isDark ? "rgba(148,163,184,0.2)" : "rgba(148,163,184,0.2)",
    tooltipText: isDark ? "#e2e8f0" : "#334155",
  };
}
