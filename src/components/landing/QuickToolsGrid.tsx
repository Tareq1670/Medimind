"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarCheck,
  Pill,
  HeartPulse,
  ScanSearch,
  ArrowRight,
} from "@/lib/icon-map";

const tools = [
  {
    href: "/ai-assistant",
    title: "Book Consultation",
    description: "Connect with verified specialists via video or chat within minutes.",
    icon: CalendarCheck,
    color: "from-[#2563EB] to-[#1D4ED8]",
    gradient: "from-[#2563EB]/5 to-[#1D4ED8]/5 dark:from-[#2563EB]/10 dark:to-[#1D4ED8]/10",
    borderGlow: "group-hover:border-[#2563EB]/30",
  },
  {
    href: "/medicines",
    title: "Order Prescription",
    description: "Refill and manage your prescriptions with automated delivery tracking.",
    icon: Pill,
    color: "from-[#14B8A6] to-[#0D9488]",
    gradient: "from-[#14B8A6]/5 to-[#0D9488]/5 dark:from-[#14B8A6]/10 dark:to-[#0D9488]/10",
    borderGlow: "group-hover:border-[#14B8A6]/30",
  },
  {
    href: "/health-records",
    title: "Track Vitals",
    description: "Monitor blood pressure, glucose, heart rate and more in one dashboard.",
    icon: HeartPulse,
    color: "from-[#2563EB] to-[#1D4ED8]",
    gradient: "from-[#2563EB]/5 to-[#1D4ED8]/5 dark:from-[#2563EB]/10 dark:to-[#1D4ED8]/10",
    borderGlow: "group-hover:border-[#2563EB]/30",
  },
  {
    href: "/report-analysis",
    title: "Upload Diagnostic Scan",
    description: "AI-powered analysis of lab reports, X-rays, and medical imaging.",
    icon: ScanSearch,
    color: "from-[#14B8A6] to-[#0D9488]",
    gradient: "from-[#14B8A6]/5 to-[#0D9488]/5 dark:from-[#14B8A6]/10 dark:to-[#0D9488]/10",
    borderGlow: "group-hover:border-[#14B8A6]/30",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export function QuickToolsGrid() {
  return (
    <section className="relative py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Your Health Tools
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Everything you need to manage your healthcare journey in one place.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href}>
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -4, transition: { duration: 0.2 } }}
                className={`group relative overflow-hidden rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6 sm:p-8 transition-all duration-200 ${tool.borderGlow}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} shadow-lg`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {tool.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {tool.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] dark:text-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Get started <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
