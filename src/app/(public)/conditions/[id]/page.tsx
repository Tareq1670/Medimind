"use client";

import { use } from "react";
import Link from "next/link";
import { useCondition } from "@/hooks/useConditions";
import { LoadingSpinner } from "@/components/shared";
import { ChevronLeft, AlertTriangle, Lightbulb, FileText } from "@/lib/icon-map";
import { cn } from "@/lib/utils";

const severityStyles: Record<string, { label: string; badge: string; bg: string }> = {
  Low: { label: "Low Severity", badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700", bg: "bg-green-50 dark:bg-green-900/10" },
  Medium: { label: "Medium Severity", badge: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700", bg: "bg-yellow-50 dark:bg-yellow-900/10" },
  High: { label: "High Severity", badge: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700", bg: "bg-red-50 dark:bg-red-900/10" },
};

export default function ConditionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: condition, isLoading, isError } = useCondition(id);

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner size="lg" text="Loading condition details..." /></div>;
  }

  if (isError || !condition) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">Condition Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The condition you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/conditions" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back to Conditions
        </Link>
      </div>
    );
  }

  const severityInfo = severityStyles[condition.severity] || severityStyles.Low;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <Link href="/conditions" className="hover:text-primary transition-colors">Conditions</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium truncate">{condition.title}</span>
      </nav>

      <div className="card-standard p-6 md:p-8 mb-6">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-primary/10"><AlertTriangle className="w-6 h-6 text-primary" /></div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{condition.title}</h1>
              <span className={cn("px-3 py-1 text-xs font-semibold rounded-full border", severityInfo.badge)}>{condition.severity}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">{condition.description}</p>
          </div>
        </div>
      </div>

      <div className={cn("card-standard p-6 mb-6 border-l-4", severityInfo.bg)}>
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 mt-0.5 text-slate-600 dark:text-slate-300" />
          <div>
            <h3 className="font-heading font-semibold text-slate-900 dark:text-white text-sm">Severity: {severityInfo.label}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {condition.severity === "Low" && "Mild condition that typically resolves with basic care. Monitor symptoms and consult if they persist."}
              {condition.severity === "Medium" && "Moderate condition requiring medical attention. Schedule an appointment with your healthcare provider."}
              {condition.severity === "High" && "Serious condition requiring immediate medical attention. Seek emergency care if symptoms are severe."}
            </p>
          </div>
        </div>
      </div>

      {condition.symptoms && condition.symptoms.length > 0 && (
        <div className="card-standard p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Common Symptoms</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {condition.symptoms.map((symptom, i) => (
              <span key={i} className="px-3 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{symptom}</span>
            ))}
          </div>
        </div>
      )}

      {condition.precautions && condition.precautions.length > 0 && (
        <div className="card-standard p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Precautions & Recommendations</h2>
          </div>
          <ul className="space-y-2">
            {condition.precautions.map((precaution, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {precaution}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card-standard p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Medical Disclaimer</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          This information is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </p>
      </div>
    </div>
  );
}
