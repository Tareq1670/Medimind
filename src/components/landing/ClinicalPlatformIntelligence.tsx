"use client";

import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const stabilizationData = [
  { month: "Feb", patients: 320, stabilized: 240 },
  { month: "Mar", patients: 380, stabilized: 300 },
  { month: "Apr", patients: 420, stabilized: 350 },
  { month: "May", patients: 490, stabilized: 420 },
  { month: "Jun", patients: 540, stabilized: 480 },
  { month: "Jul", patients: 610, stabilized: 560 },
];

const accuracyData = [
  { quarter: "Q1 2026", accuracy: 87, reports: 1240 },
  { quarter: "Q2 2026", accuracy: 91, reports: 1890 },
  { quarter: "Q3 2026", accuracy: 94, reports: 2150 },
  { quarter: "Q4 2026", accuracy: 96, reports: 2780 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function AreaTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-900 dark:text-slate-50 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="font-medium text-slate-900 dark:text-slate-50">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function BarTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-3 shadow-lg text-xs">
      <p className="font-semibold text-slate-900 dark:text-slate-50 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}:</span>
          <span className="font-medium text-slate-900 dark:text-slate-50">
            {entry.name === "Accuracy" ? `${entry.value}%` : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function ClinicalPlatformIntelligence() {
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
            Clinical Performance Metrics
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Real-world efficacy data demonstrating the impact of AI-assisted healthcare.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-5 sm:p-6">
            <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
              Patient Stabilization Trends
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Monthly patients under AI-assisted monitoring
            </p>
            <div className="mt-4 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stabilizationData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "var(--color-neutral)" }}
                    axisLine={{ stroke: "var(--color-border-subtle)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-neutral)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<AreaTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="patients"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="none"
                    strokeDasharray="4 4"
                    name="Total Patients"
                  />
                  <Area
                    type="monotone"
                    dataKey="stabilized"
                    stroke="#14B8A6"
                    strokeWidth={2.5}
                    fill="url(#areaFill)"
                    name="Stabilized"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-5 sm:p-6">
            <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
              Report Processing Accuracy
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Quarterly accuracy metrics across all automated analyses
            </p>
            <div className="mt-4 h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accuracyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" />
                  <XAxis
                    dataKey="quarter"
                    tick={{ fontSize: 11, fill: "var(--color-neutral)" }}
                    axisLine={{ stroke: "var(--color-border-subtle)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-neutral)" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <Tooltip content={<BarTooltip />} />
                  <Bar
                    dataKey="accuracy"
                    fill="#2563EB"
                    radius={[6, 6, 0, 0]}
                    name="Accuracy"
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
