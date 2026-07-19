"use client";

import { motion } from "framer-motion";
import { FileText, Tags, Sparkles } from "lucide-react";

const engines = [
  {
    title: "AI Report Intelligence",
    subtitle: "Multi-modal Document Extractor",
    description:
      "Processes lab reports, radiology scans, and clinical notes using advanced vision-language models. Extracts biomarkers, highlights anomalies, and generates structured summaries in seconds.",
    icon: FileText,
    capabilities: [
      "OCR & Handwriting Recognition",
      "Anomaly Detection Engine",
      "Structured Data Extraction",
      "Longitudinal Trend Analysis",
    ],
    gradient: "from-[#14B8A6] to-[#0D9488]",
    bgGradient:
      "from-[#14B8A6]/5 to-[#0D9488]/5 dark:from-[#14B8A6]/10 dark:to-[#0D9488]/5",
  },
  {
    title: "AI Content Intelligence",
    subtitle: "Clinical Data Tagging & Classification Engine",
    description:
      "Automatically categorizes medical content using hierarchical ontology mapping. Powers search, recommendation, and clinical decision support across the entire platform ecosystem.",
    icon: Tags,
    capabilities: [
      "ICD-11 Auto-Coding",
      "Semantic Search Indexing",
      "Drug-Drug Interaction Alerts",
      "Personalized Health Insights",
    ],
    gradient: "from-[#2563EB] to-[#1D4ED8]",
    bgGradient:
      "from-[#2563EB]/5 to-[#1D4ED8]/5 dark:from-[#2563EB]/10 dark:to-[#1D4ED8]/5",
  },
];

const engineVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function AIEngineSpotlight() {
  return (
    <section className="relative py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Powered by Advanced Agentic AI
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Two specialized AI engines work in concert to deliver accurate,
            context-aware healthcare intelligence.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {engines.map((engine) => (
            <motion.div
              key={engine.title}
              variants={engineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ scale: 1.01, y: -4, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6 sm:p-8 transition-all duration-200"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${engine.bgGradient}`} />
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div
                    className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${engine.gradient} shadow-lg`}
                  >
                    <engine.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-slate-50">
                      {engine.title}
                    </h3>
                    <p className="text-sm font-medium text-[var(--color-secondary)] dark:text-[var(--color-secondary)]">
                      {engine.subtitle}
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {engine.description}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {engine.capabilities.map((cap) => (
                    <div
                      key={cap}
                      className="flex items-center gap-2 rounded-lg bg-white/50 dark:bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                    >
                      <Sparkles className="h-3 w-3 shrink-0 text-[var(--color-secondary)]" />
                      {cap}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
