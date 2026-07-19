"use client";

import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { ArrowRight, ShieldCheck } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface HeroSliderProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const slides = [
  {
    key: "symptom",
    title: "AI Symptom Intelligence",
    description:
      "Describe your symptoms in natural language and let our advanced AI analyze patterns across thousands of clinical datasets. Receive instant preliminary insights and recommended next steps.",
    primaryCta: "Diagnose with AI",
    secondaryCta: "Learn More",
    primaryHref: "/ai-assistant",
    secondaryHref: "/how-it-works",
    gradient: "from-[#14B8A6]/20 via-[#14B8A6]/5 to-transparent",
    Graphic: SymptomGraphic,
  },
  {
    key: "diagnostic",
    title: "Instant Diagnostic Analytics",
    description:
      "Upload medical reports, lab results, or diagnostic images and receive a comprehensive AI-powered analysis. Our multi-modal engine extracts and interprets clinical data in seconds.",
    primaryCta: "Analyze Now",
    secondaryCta: "See Examples",
    primaryHref: "/report-analysis",
    secondaryHref: "/blogs",
    gradient: "from-[#2563EB]/20 via-[#2563EB]/5 to-transparent",
    Graphic: DiagnosticGraphic,
  },
  {
    key: "prescription",
    title: "Smart Prescription Management",
    description:
      "Manage your medications intelligently with automated reminders, dosage tracking, and AI-powered interaction checks. Never miss a dose or risk an adverse drug interaction again.",
    primaryCta: "Manage Medications",
    secondaryCta: "Explore Pharmacy",
    primaryHref: "/medicines",
    secondaryHref: "/medicines",
    gradient: "from-[#14B8A6]/20 via-[#14B8A6]/5 to-transparent",
    Graphic: PrescriptionGraphic,
  },
];

function SymptomGraphic() {
  return (
    <svg viewBox="0 0 400 320" className="h-full w-full" role="img" aria-label="AI neural network visualization">
      <defs>
        <radialGradient id="pulse-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="160" r="100" fill="url(#pulse-grad)" />
      <circle cx="200" cy="160" r="12" fill="#14B8A6" opacity="0.8" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const r = 55;
        const cx = 200 + r * Math.cos(angle);
        const cy = 160 + r * Math.sin(angle);
        return (
          <g key={i}>
            <line x1="200" y1="160" x2={cx} y2={cy} stroke="#14B8A6" strokeWidth="1.5" opacity="0.4" />
            <circle cx={cx} cy={cy} r="6" fill="#2563EB" opacity="0.7" />
          </g>
        );
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const r = 90;
        const cx = 200 + r * Math.cos(angle);
        const cy = 160 + r * Math.sin(angle);
        return <circle key={`outer-${i}`} cx={cx} cy={cy} r="3" fill="#14B8A6" opacity="0.5" />;
      })}
    </svg>
  );
}

function DiagnosticGraphic() {
  return (
    <svg viewBox="0 0 400 320" className="h-full w-full" role="img" aria-label="Medical diagnostic chart visualization">
      <defs>
        <linearGradient id="line-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="320" height="240" rx="12" fill="url(#line-grad)" />
      <polyline
        points="60,240 100,180 140,200 180,120 220,140 260,80 300,100 340,60"
        fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.8"
      />
      <polyline
        points="60,240 100,210 140,230 180,160 220,170 260,110 300,130 340,90"
        fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"
      />
      {[60, 100, 140, 180, 220, 260, 300, 340].map((x, i) => (
        <circle key={x} cx={x} cy={[240, 180, 200, 120, 140, 80, 100, 60][i]} r="4" fill="#2563EB" />
      ))}
    </svg>
  );
}

function PrescriptionGraphic() {
  return (
    <svg viewBox="0 0 400 320" className="h-full w-full" role="img" aria-label="Prescription document visualization">
      <defs>
        <linearGradient id="doc-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="100" y="50" width="200" height="240" rx="12" fill="url(#doc-grad)" stroke="#14B8A6" strokeWidth="1" strokeOpacity="0.3" />
      <rect x="100" y="50" width="200" height="8" rx="4" fill="#14B8A6" opacity="0.3" />
      <line x1="130" y1="90" x2="270" y2="90" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="130" y1="110" x2="250" y2="110" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="130" y1="130" x2="260" y2="130" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="130" y1="150" x2="240" y2="150" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="130" y1="170" x2="255" y2="170" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <line x1="130" y1="190" x2="245" y2="190" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="130" y1="210" x2="265" y2="210" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <rect x="130" y="230" width="140" height="4" rx="2" fill="#14B8A6" opacity="0.2" />
      <rect x="130" y="240" width="100" height="4" rx="2" fill="#14B8A6" opacity="0.2" />
      <circle cx="200" cy="280" r="16" fill="none" stroke="#14B8A6" strokeWidth="2" opacity="0.5" />
      <path d="M193 280 L198 285 L207 276" fill="none" stroke="#14B8A6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

export function HeroSlider({ isAuthenticated, isLoading }: HeroSliderProps) {
  const renderCta = useCallback(
    (slide: (typeof slides)[number]) => {
      const primaryHref = slide.key === "symptom" && !isAuthenticated ? "/register" : slide.primaryHref;

      return (
        <div className="flex flex-wrap items-center gap-4 mt-6 mb-12 lg:mb-0">
          <Link
            href={primaryHref}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="inline-block h-4 w-24 animate-pulse rounded bg-white/30" />
            ) : slide.key === "symptom" && !isAuthenticated ? (
              <><span>Start Free</span><ArrowRight className="h-4 w-4" /></>
            ) : (
              <><span>{slide.primaryCta}</span><ArrowRight className="h-4 w-4" /></>
            )}
          </Link>
          <Link
            href={slide.secondaryHref}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-[var(--radius-button)] border border-slate-300 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 backdrop-blur-sm transition-all duration-200 hover:bg-white dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            {slide.secondaryCta}
          </Link>
        </div>
      );
    },
    [isAuthenticated, isLoading],
  );

  return (
    <section className="relative w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        loop
        className="[&_.swiper-pagination]:!bottom-4 w-full min-h-[75vh] lg:!h-[70vh]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.key}>
            <div className="relative flex h-full w-full items-center">
              <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />
              <div className="absolute inset-0 bg-[var(--bg-radial)]" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full min-h-full px-4 md:px-8 max-w-7xl mx-auto py-12 lg:py-0">
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex flex-col justify-center text-left max-w-xl order-last lg:order-first"
                >
                  <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/20 px-3.5 py-1.5 text-xs font-medium text-[var(--color-secondary)] mb-4">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Powered by MediMind AI
                  </div>
                  <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-slate-900 dark:text-slate-50">
                    {slide.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 dark:text-slate-300">
                    {slide.description}
                  </p>
                  {renderCta(slide)}
                </motion.div>
                <div className="flex justify-center items-center w-full max-w-md mx-auto aspect-square order-first lg:order-last">
                  <div className="relative w-4/5 sm:w-2/3 md:w-full max-h-[250px] sm:max-h-[320px] lg:max-h-[450px] flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[var(--color-secondary)]/5 dark:bg-[var(--color-secondary)]/10 animate-pulse" />
                    <slide.Graphic />
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-bg-app)] to-transparent z-10" />
    </section>
  );
}
