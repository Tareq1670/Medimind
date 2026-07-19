"use client";

import { motion } from "framer-motion";
import { UserCheck, Bot, Stethoscope, FileText } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Secure Authentication",
    description:
      "Create your encrypted health profile with role-based access. Your data is protected with industry-standard security protocols.",
    icon: UserCheck,
  },
  {
    number: 2,
    title: "AI Symptom & Report Scan",
    description:
      "Our multi-modal AI engine analyzes your symptoms, lab reports, and medical history to generate preliminary clinical insights.",
    icon: Bot,
  },
  {
    number: 3,
    title: "Clinical Verification",
    description:
      "Insights are cross-referenced with our network of verified specialists who review and validate AI-generated recommendations.",
    icon: Stethoscope,
  },
  {
    number: 4,
    title: "Prescription & Care Plan",
    description:
      "Receive a personalized care plan with digital prescriptions, automated refill reminders, and ongoing health monitoring.",
    icon: FileText,
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function HowItWorks() {
  return (
    <section className="relative py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            From Symptom to Solution in Four Steps
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Our streamlined process combines AI speed with clinical accuracy.
          </p>
        </div>

        <div className="relative mt-14">
          <div className="hidden md:block absolute left-0 right-0 top-12 h-0.5 bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-secondary)]/40 to-[var(--color-primary)]/20" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative flex flex-col items-center text-center md:text-left md:items-start"
              >
                <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-secondary)]/10 to-[var(--color-secondary)]/5 dark:from-[var(--color-secondary)]/20 dark:to-transparent border border-[var(--color-secondary)]/20 dark:border-[var(--color-secondary)]/30 mx-auto md:mx-0">
                  <div className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] text-[11px] font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                  <step.icon className="h-10 w-10 text-[var(--color-secondary)]" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
