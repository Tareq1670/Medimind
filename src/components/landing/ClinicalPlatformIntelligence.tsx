"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Users, Pill, Heart, Activity } from "@/lib/icon-map";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

const stats = [
  { icon: Users, label: "Active Users", value: 10000, suffix: "+", color: "from-[#2563EB] to-[#1D4ED8]" },
  { icon: Pill, label: "Medicines", value: 500, suffix: "+", color: "from-[#14B8A6] to-[#0D9488]" },
  { icon: Heart, label: "Conditions Tracked", value: 50, suffix: "+", color: "from-[#2563EB] to-[#1D4ED8]" },
  { icon: Activity, label: "AI Accuracy", value: 95, suffix: "%", color: "from-[#14B8A6] to-[#0D9488]" },
];

const conditionsData = [
  { name: "Respiratory", value: 35, color: "#2563EB" },
  { name: "Cardiovascular", value: 22, color: "#14B8A6" },
  { name: "Metabolic", value: 18, color: "#8B5CF6" },
  { name: "Neurological", value: 14, color: "#F59E0B" },
  { name: "Other", value: 11, color: "#64748B" },
];

const growthData = [
  { month: "Jan", users: 1200, accuracy: 88 },
  { month: "Mar", users: 2800, accuracy: 90 },
  { month: "May", users: 4500, accuracy: 92 },
  { month: "Jul", users: 6200, accuracy: 93 },
  { month: "Sep", users: 8100, accuracy: 94 },
  { month: "Nov", users: 9400, accuracy: 95 },
  { month: "Dec", users: 10000, accuracy: 95 },
];

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  const { count, ref } = useCountUp(stat.value, 2000);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
      className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6 text-center transition-all duration-200"
    >
      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mx-auto`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <p className="mt-4 font-heading text-3xl font-bold text-slate-900 dark:text-slate-50">
        {count.toLocaleString()}{stat.suffix}
      </p>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        {stat.label}
      </p>
    </motion.div>
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
            Trusted by Thousands
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Real-world impact data demonstrating the scale of MediMind&apos;s AI-assisted healthcare platform.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6"
          >
            <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
              Conditions by Category
            </h3>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              Distribution of tracked health conditions
            </p>
            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {conditionsData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid rgba(148,163,184,0.2)",
                      background: "var(--color-bg-app, #fff)",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [`${value}%`, "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {conditionsData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{entry.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6"
          >
            <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
              Platform Growth
            </h3>
            <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
              User adoption and AI accuracy over time
            </p>
            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="users" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="accuracy" orientation="right" domain={[80, 100]} tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid rgba(148,163,184,0.2)",
                      background: "var(--color-bg-app, #fff)",
                      fontSize: "12px",
                    }}
                  />
                  <Line yAxisId="users" type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2.5} dot={false} name="Users" />
                  <Line yAxisId="accuracy" type="monotone" dataKey="accuracy" stroke="#14B8A6" strokeWidth={2.5} dot={false} name="Accuracy %" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex justify-center gap-6">
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded-full bg-[#2563EB]" />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Users</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded-full bg-[#14B8A6]" style={{ borderBottom: "2px dashed #14B8A6", height: 0 }} />
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Accuracy %</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
