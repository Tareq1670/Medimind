"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useMedicine } from "@/hooks/useMedicines";
import { StarRating, LoadingSpinner } from "@/components/shared";
import { Pill, ArrowRight, Shield, Clock, ChevronLeft } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

const TAB_KEYS = ["overview", "dosage", "side-effects", "ai-insights"] as const;
type TabKey = (typeof TAB_KEYS)[number];

const TAB_LABELS: Record<TabKey, string> = {
  overview: "Overview",
  dosage: "Dosage & Usage",
  "side-effects": "Side Effects",
  "ai-insights": "AI Insights",
};

export default function MedicineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: medicine, isLoading, isError } = useMedicine(id);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading medicine details..." />
      </div>
    );
  }

  if (isError || !medicine) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Pill className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">Medicine Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The medicine you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/medicines" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Medicines
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/medicines" className="hover:text-primary transition-colors">Medicines</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{medicine.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <div className="card-standard overflow-hidden">
            <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-8">
              <img
                src={medicine.image || "https://i.ibb.co/n610Bc4/paracetamol.jpg"}
                alt={medicine.name}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className={cn(
              "px-3 py-1 text-xs font-semibold rounded-full",
              medicine.isPrescriptionRequired
                ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700"
                : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700",
            )}>
              {medicine.isPrescriptionRequired ? "Prescription Required" : "Over-the-counter"}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
              {medicine.category}
            </span>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {medicine.name}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 mt-1">{medicine.genericName}</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{medicine.manufacturer}</p>

          <div className="flex items-center gap-4 mt-4">
            <StarRating rating={medicine.rating || 0} size="md" showValue />
            <span className="text-sm text-slate-500 dark:text-slate-400">({medicine.reviewCount || 0} reviews)</span>
          </div>

          <div className="mt-6">
            <span className="text-3xl font-bold text-primary">${medicine.price?.toFixed(2)}</span>
          </div>

          <div className="flex flex-wrap gap-6 mt-8">
            {medicine.isPrescriptionRequired && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <Shield className="w-4 h-4 text-amber-500" />
                Prescription required for purchase
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <Clock className="w-4 h-4 text-primary" />
              Updated {new Date(medicine.updatedAt).toLocaleDateString()}
            </div>
          </div>

          <div className="mt-8 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-0 -mb-px overflow-x-auto">
              {TAB_KEYS.map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                    activeTab === key
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
                  )}
                >
                  {TAB_LABELS[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {activeTab === "overview" && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {medicine.description || "No description available for this medicine."}
                </p>
              </div>
            )}
            {activeTab === "dosage" && (
              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Dosage & Usage</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Always follow the dosage instructions provided by your healthcare provider. The information shown here is for reference only.
                </p>
                {medicine.dosageForm && (
                  <p className="mt-3 text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Form:</span> {medicine.dosageForm}
                  </p>
                )}
                {medicine.strength && (
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    <span className="font-medium">Strength:</span> {medicine.strength}
                  </p>
                )}
                <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    ⚠ Consult a healthcare professional before use. Do not exceed the recommended dose.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "side-effects" && (
              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Side Effects</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Common side effects may include nausea, dizziness, headache, or allergic reactions. Contact your doctor if you experience severe side effects.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-xs text-red-700 dark:text-red-300">
                    🚨 Seek immediate medical help if you experience signs of an allergic reaction: hives, difficulty breathing, swelling of face/lips/tongue/throat.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "ai-insights" && (
              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">AI-Powered Insights</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Our AI can provide personalized insights about this medicine. Use the AI Assistant feature to ask questions about interactions, timing, and more.
                </p>
                <Link
                  href="/ai-assistant"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                >
                  Ask AI Assistant <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
