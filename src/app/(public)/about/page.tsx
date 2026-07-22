"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BrainCircuit,
  HeartPulse,
  Shield,
  Users,
  Stethoscope,
  Bot,
  Sparkles,
  ArrowRight,
  Activity,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
} from "@/lib/icon-map";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const stats = [
  { value: "10K+", label: "Patients Served", icon: Users },
  { value: "500+", label: "Medicines Tracked", icon: Activity },
  { value: "50+", label: "Health Conditions", icon: HeartPulse },
  { value: "95%", label: "Analysis Accuracy", icon: BrainCircuit },
];

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Every health record is encrypted end-to-end. We never sell personal data and comply with HIPAA-grade security standards.",
  },
  {
    icon: BrainCircuit,
    title: "AI with Clinical Oversight",
    description:
      "Our AI generates preliminary insights, but every recommendation is designed to be reviewed by licensed professionals.",
  },
  {
    icon: Users,
    title: "Patient-Centered Design",
    description:
      "Built around real patient journeys. From symptom onset to care plan, every screen reduces friction and anxiety.",
  },
  {
    icon: Sparkles,
    title: "Continuous Learning",
    description:
      "Our models improve with de-identified clinical feedback, staying current with the latest medical research and guidelines.",
  },
];

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    bio: "Board-certified internist with 15 years of clinical experience. Leads medical accuracy and AI safety protocols.",
    initials: "SC",
  },
  {
    name: "James Okafor",
    role: "Head of Engineering",
    bio: "Full-stack architect specializing in healthcare systems. Previously built patient platforms serving 1M+ users.",
    initials: "JO",
  },
  {
    name: "Dr. Priya Sharma",
    role: "AI Research Lead",
    bio: "PhD in biomedical NLP. Published 20+ papers on clinical language models and automated diagnosis support.",
    initials: "PS",
  },
  {
    name: "Marcus Rivera",
    role: "Product Designer",
    bio: "Healthcare UX specialist focused on reducing cognitive load for patients navigating complex medical information.",
    initials: "MR",
  },
];

const timeline = [
  {
    year: "2023",
    title: "The Problem",
    description:
      "Patients spent hours decoding lab results, cross-referencing medications, and waiting for appointments just to understand basic health data.",
  },
  {
    year: "2024",
    title: "The founding",
    description:
      "A team of clinicians and engineers came together with a shared belief: AI can bridge the gap between raw health data and patient understanding.",
  },
  {
    year: "2025",
    title: "First launch",
    description:
      "MediMind shipped its first AI symptom checker and medicine database, serving thousands of patients within months.",
  },
  {
    year: "Today",
    title: "Growing impact",
    description:
      "Full platform with AI-powered report analysis, doctor consultations, health records, and intelligent medicine tracking.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative pt-28 pb-12 md:pt-32 md:pb-20 text-center"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10 blur-3xl" />
          <div className="absolute top-1/2 right-0 h-64 w-64 rounded-full bg-[var(--color-secondary)]/5 dark:bg-[var(--color-secondary)]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary)]/10 dark:bg-[var(--color-primary)]/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--color-primary)]">
            <HeartPulse className="h-3 w-3" />
            About MediMind
          </span>

          <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
            Healthcare Intelligence,{" "}
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Made Accessible
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-500 dark:text-slate-400 sm:text-lg">
            MediMind combines clinical-grade AI with a patient-first design to
            help you understand your health, not just manage it. We believe
            everyone deserves clarity about their own body.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/symptom-checker"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              Try Symptom Checker
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 backdrop-blur-sm transition-all duration-200 hover:bg-white dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative py-12 md:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
                className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 flex flex-col items-center text-center p-6"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] shadow-lg">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <p className="mt-4 font-heading text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Our Story */}
      <section className="relative py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
                From Frustration to a Platform
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>
                  It started with a simple question a patient asked a doctor:
                  &ldquo;Can you just explain what this lab result means in plain
                  English?&rdquo; That question exposed a massive gap. Patients
                  were receiving more health data than ever, but less
                  understanding than they needed.
                </p>
                <p>
                  Our founding team spent months interviewing patients,
                  pharmacists, and physicians. The pattern was clear: the
                  bottleneck was not access to data. It was access to{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    meaning
                  </span>
                  . A blood panel is useless if you cannot connect it to your
                  daily life. A prescription is just a label without context
                  about interactions, side effects, and alternatives.
                </p>
                <p>
                  MediMind was built to close that gap. Our AI does not replace
                  doctors. It translates the clinical world into language and
                  actions that empower patients to participate in their own care
                  with confidence.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              <div className="relative rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6 sm:p-8">
                <div className="absolute -top-3 -right-3 h-24 w-24 rounded-full bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/15 blur-2xl" />
                <div className="relative space-y-5">
                  {timeline.map((item, i) => (
                    <div key={item.year} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-[11px] font-bold text-white">
                          {item.year}
                        </div>
                        {i < timeline.length - 1 && (
                          <div className="mt-2 h-full w-px bg-gradient-to-b from-[var(--color-primary)]/30 to-transparent" />
                        )}
                      </div>
                      <div className="pb-2">
                        <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Technology */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative py-12 md:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              AI That Understands Medicine
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
              Three specialized AI models, each trained for a specific clinical
              task, working together to deliver accurate and actionable insights.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Bot,
                title: "Symptom Analysis",
                model: "Groq Llama3-70B",
                description:
                  "Fast, conversational symptom triage that cross-references your inputs against a medical knowledge graph to suggest possible conditions and urgency levels.",
                color: "from-[#14B8A6] to-[#0D9488]",
              },
              {
                icon: Stethoscope,
                title: "Report Intelligence",
                model: "Gemini Pro Vision",
                description:
                  "Upload lab reports, X-rays, or prescriptions. Our vision model extracts key biomarkers, flags anomalies, and generates a plain-language summary.",
                color: "from-[#2563EB] to-[#1D4ED8]",
              },
              {
                icon: BrainCircuit,
                title: "Health Assistant",
                model: "Gemini 1.5 Flash",
                description:
                  "A streaming chat assistant that remembers your conversation history. Ask about medications, conditions, or care plans in natural language.",
                color: "from-[#7C3AED] to-[#6D28D9]",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
                className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 p-6 sm:p-8"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}
                >
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {item.model}
                </p>
                <h3 className="mt-1 font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Values */}
      <section className="relative py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              What Guides Every Decision
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
              Technology should serve patients, not the other way around. These
              principles shape every feature we ship.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
                className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 flex gap-5 p-6"
              >
                <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] shadow-lg">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative py-12 md:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
              The People Behind MediMind
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
              Clinicians, engineers, and designers united by a belief that
              healthcare technology should reduce confusion, not add to it.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4, transition: { duration: 0.2 } }}
                className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 flex flex-col items-center text-center p-6"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-lg font-bold text-white shadow-lg">
                  {member.initials}
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-slate-900 dark:text-slate-50">
                  {member.name}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-[var(--color-secondary)]">
                  {member.role}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative py-12 md:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/5 dark:from-[var(--color-primary)]/10 dark:to-[var(--color-secondary)]/5 backdrop-blur-sm px-6 py-12 sm:px-12 sm:py-16 text-center">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--color-secondary)]/5 dark:bg-[var(--color-secondary)]/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
                Ready to Take Control of Your Health?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-slate-500 dark:text-slate-400">
                Start with a free symptom check, explore our medicine database,
                or read the latest health insights from our AI-curated blog.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/symptom-checker"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 backdrop-blur-sm transition-all duration-200 hover:bg-white dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick Contact Info */}
      <section className="relative pb-12 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Mail, label: "Email", value: "hello@medimind.dev" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Location", value: "San Francisco, CA" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 flex items-center gap-3 px-5 py-4"
              >
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-sm">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
