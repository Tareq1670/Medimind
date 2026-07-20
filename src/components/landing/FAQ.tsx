"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "@/lib/icon-map";

const faqs = [
  {
    q: "What is MediMind and how does it work?",
    a: "MediMind is an AI-powered healthcare platform that connects patients with verified doctors, provides AI symptom analysis, manages prescriptions, and offers personalized health insights. Our AI engine analyzes your symptoms and medical data to provide preliminary assessments, while our network of verified healthcare professionals ensures you receive accurate, personalized care.",
  },
  {
    q: "Is the AI symptom checker a replacement for a doctor?",
    a: "No. MediMind's AI symptom checker provides preliminary assessments and educational information to help you understand your symptoms better. It is not a substitute for professional medical advice, diagnosis, or treatment. We always recommend consulting a qualified healthcare provider for definitive diagnosis and treatment decisions.",
  },
  {
    q: "How accurate is the AI-powered report analysis?",
    a: "Our AI report analysis engine achieves over 95% accuracy in extracting and interpreting medical data from lab reports, radiology scans, and clinical notes. However, all AI-generated insights are flagged for review and should be verified by a healthcare professional before making any medical decisions.",
  },
  {
    q: "Are my health records and personal data secure?",
    a: "Absolutely. MediMind uses industry-standard encryption (AES-256) for all data at rest and TLS 1.3 for data in transit. We are HIPAA-compliant and never share your personal health information with third parties without your explicit consent. Your data is stored securely and you can request deletion at any time.",
  },
  {
    q: "How do I book a consultation with a doctor?",
    a: "Navigate to the Doctors page, browse verified specialists by specialty, and click 'Book Appointment' on any doctor's profile. You can select your preferred time slot and consultation type (video, chat, or in-person). Payment is processed securely through our platform.",
  },
  {
    q: "What types of medical reports can the AI analyze?",
    a: "MediMind's AI can analyze a wide range of medical reports including blood test results, urine analysis, X-rays, MRI scans, CT scans, ECG reports, pathology reports, and more. Our multi-modal vision engine extracts biomarkers, highlights anomalies, and generates structured summaries with plain-English explanations.",
  },
  {
    q: "Can I manage prescriptions for my entire family?",
    a: "Yes. MediMind supports family account management. You can add family members to your account, manage their prescriptions separately, set individual medication reminders, and track health records for each member. Each profile maintains its own secure health data.",
  },
  {
    q: "How does the medicine recommendation feature work?",
    a: "Our AI medicine recommendation engine considers your reported symptoms, known health conditions, current medications, and health goals to suggest appropriate medicines and supplements. It also flags potential drug interactions and provides lifestyle recommendations. All suggestions should be reviewed by your healthcare provider.",
  },
  {
    q: "Is MediMind available in my country?",
    a: "MediMind is currently available in select regions and is expanding rapidly. Our platform supports multiple languages and currencies. Check our contact page for the latest information on availability in your area, or reach out to our support team for assistance.",
  },
  {
    q: "How do I report a bug or suggest a feature?",
    a: "We welcome your feedback! You can report bugs or suggest features through our Contact page, or by visiting our GitHub repository. Our development team reviews all submissions and prioritizes features based on community demand and clinical impact.",
  },
];

function FaqItem({ item, isOpen, onToggle }: {
  item: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[var(--radius-card)] border border-slate-200/50 dark:border-slate-700/50 bg-white dark:bg-slate-900/80 overflow-hidden transition-all duration-200">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-sm font-semibold text-slate-900 dark:text-slate-50">
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown className="h-4 w-4 text-slate-400 dark:text-slate-500" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="relative py-12 md:py-20 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500 dark:text-slate-400">
            Everything you need to know about MediMind and our AI-powered healthcare platform.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
