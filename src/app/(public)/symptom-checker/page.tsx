"use client";

import { useState } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/shared";
import { Search, X, AlertTriangle, Lightbulb, ArrowRight, ChevronLeft, Stethoscope, BrainCircuit, CheckCircle } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { COMMON_SYMPTOMS, SYMPTOM_DURATIONS } from "@/constants";
import { aiService } from "@/services";
import toast from "react-hot-toast";

type Step = 1 | 2 | 3;

interface Condition {
  name: string;
  description: string;
  probability: number;
  color: string;
}

interface Results {
  urgency: "Low" | "Medium" | "High" | "Critical";
  conditions: Condition[];
  recommendations: string[];
  warningSigns: string[];
  verdict: string;
  shouldSeeDoctor: boolean;
  doctorType: string;
  lifestyleAdvice: string[];
}

const BODY_SYSTEM_GROUPS = [
  { name: "Head & Neck", symptoms: ["Headache", "Dizziness", "Sore Throat", "Blurred Vision", "Numbness", "Anxiety", "Depression", "Insomnia"] },
  { name: "Chest", symptoms: ["Chest Pain", "Shortness of Breath", "Cough", "Palpitations"] },
  { name: "Abdomen", symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Loss of Appetite", "Indigestion", "Constipation"] },
  { name: "General", symptoms: ["Fever", "Fatigue", "Body Ache", "Night Sweats", "Weight Loss", "Muscle Weakness", "Joint Pain", "Skin Rash"] },
  { name: "Other", symptoms: ["Swollen Lymph Nodes", "Frequent Urination", "Back Pain"] },
];

const SEVERITY_LEVELS = [
  { value: 1, label: "1", desc: "Barely noticeable" },
  { value: 2, label: "2", desc: "Mild" },
  { value: 3, label: "3", desc: "Uncomfortable" },
  { value: 4, label: "4", desc: "Moderate" },
  { value: 5, label: "5", desc: "Noticeable interference" },
  { value: 6, label: "6", desc: "Significant interference" },
  { value: 7, label: "7", desc: "Hard to function" },
  { value: 8, label: "8", desc: "Severe" },
  { value: 9, label: "9", desc: "Very severe" },
  { value: 10, label: "10", desc: "Worst possible" },
];

const URGENCY_CONFIG = {
  Low: { color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", border: "border-l-green-500", icon: "check" as const },
  Medium: { color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30", border: "border-l-yellow-500", icon: "alert" as const },
  High: { color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", border: "border-l-orange-500", icon: "alert" as const },
  Critical: { color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", border: "border-l-red-500", icon: "alert" as const },
};

export default function SymptomCheckerPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedSymptomGroup, setSelectedSymptomGroup] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [gender, setGender] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(0);
  const [preExisting, setPreExisting] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const filteredSymptoms = COMMON_SYMPTOMS.filter((s) =>
    s.toLowerCase().includes(symptomSearch.toLowerCase())
  );

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      toast.error("Please select at least one symptom");
      return;
    }
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const contextParts: string[] = [];
      if (ageRange) contextParts.push(`Age: ${ageRange}`);
      if (gender) contextParts.push(`Gender: ${gender}`);
      if (preExisting) contextParts.push(`Pre-existing conditions: ${preExisting}`);
      const combinedAdditional = [additionalInfo, ...contextParts].filter(Boolean).join(". ");

      const result = await aiService.analyzeSymptoms(
        selectedSymptoms,
        duration || undefined,
        SEVERITY_LEVELS[severity]?.value ? String(SEVERITY_LEVELS[severity].value) : undefined,
        combinedAdditional || undefined
      );

      const probMap: Record<string, number> = { high: 80, medium: 50, low: 25 };
      const urgMap: Record<string, Results["urgency"]> = {
        monitor: "Low",
        routine: "Low",
        soon: "Medium",
        immediate: "Critical",
      };

      setResults({
        urgency: urgMap[result.urgencyLevel] ?? "Medium",
        conditions: (result.possibleConditions || []).map((c) => ({
          name: c.name,
          description: c.description || "A condition that may match your symptoms.",
          probability: probMap[c.probability] ?? 50,
          color: (probMap[c.probability] ?? 50) >= 60
            ? "bg-red-500"
            : (probMap[c.probability] ?? 50) >= 30
              ? "bg-yellow-500"
              : "bg-blue-500",
        })),
        recommendations: result.recommendations?.length
          ? result.recommendations
          : ["Monitor your symptoms and consult a healthcare professional if they persist."],
        warningSigns: result.warningSignsToWatch?.length
          ? result.warningSignsToWatch
          : ["Seek immediate medical attention if symptoms worsen."],
        verdict: result.urgencyExplanation || result.disclaimer || "Please consult a healthcare professional for a proper diagnosis.",
        shouldSeeDoctor: result.shouldSeeDoctor ?? false,
        doctorType: result.doctorType || "",
        lifestyleAdvice: result.lifestyleAdvice || ["Rest and stay hydrated", "Monitor your symptoms"],
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "AI analysis is currently unavailable";
      console.error("[symptom-checker] Analysis failed:", msg);
      setAnalysisError(msg);
      toast.error("AI analysis failed. Please try again.");
    }
    setAnalyzing(false);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setSymptomSearch("");
    setAgeRange("");
    setGender("");
    setDuration("");
    setSeverity(0);
    setPreExisting("");
    setAdditionalInfo("");
    setResults(null);
    setAnalysisError(null);
  };

  const handleShare = () => {
    const text = `MediMind Symptom Check\nUrgency: ${results?.urgency}\nConditions: ${results?.conditions.map((c) => c.name).join(", ")}\n\nThis is an AI-powered preliminary assessment. Always consult a healthcare professional.`;
    if (navigator.share) {
      navigator.share({ title: "MediMind Symptom Results", text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Results copied to clipboard");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-4">
          <BrainCircuit className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI Symptom Checker</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
          Describe your symptoms and get an AI-powered preliminary assessment. Always consult a healthcare professional for a definitive diagnosis.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mb-8">
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors", step >= s ? "bg-primary text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-400")}>
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            <span className={cn("text-xs hidden sm:inline", step >= s ? "text-primary font-medium" : "text-slate-400")}>
              {s === 1 ? "Symptoms" : s === 2 ? "Health Context" : "Results"}
            </span>
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="card-standard p-6 md:p-8">
          <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-2">What symptoms are you experiencing?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Select all that apply. You can also search for specific symptoms.</p>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search symptoms..." value={symptomSearch} onChange={(e) => setSymptomSearch(e.target.value)}
              aria-label="Search symptoms"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {BODY_SYSTEM_GROUPS.map((group, i) => (
              <button key={i} onClick={() => setSelectedSymptomGroup(i)}
                className={cn("px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                  selectedSymptomGroup === i ? "bg-primary text-white border-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                )}
              >
                {group.name}
              </button>
            ))}
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
              {selectedSymptoms.map((s) => (
                <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">
                  {s}
                  <button onClick={() => toggleSymptom(s)} className="hover:text-primary/70"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}

          {symptomSearch ? (
            <div className="flex flex-wrap gap-2">
              {filteredSymptoms.map((symptom) => (
                <button key={symptom} onClick={() => toggleSymptom(symptom)}
                  className={cn("px-3 py-1.5 text-sm rounded-full border transition-all",
                    selectedSymptoms.includes(symptom) ? "bg-primary text-white border-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/30 hover:bg-primary/5",
                  )}
                >
                  {symptom}
                </button>
              ))}
              {filteredSymptoms.length === 0 && <p className="text-sm text-slate-400">No symptoms found. Try a different search term.</p>}
            </div>
          ) : (
            <div className="space-y-4">
              {BODY_SYSTEM_GROUPS.map((group, gi) => (
                <div key={gi}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{group.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.symptoms.map((symptom) => (
                      <button key={symptom} onClick={() => toggleSymptom(symptom)}
                        className={cn("px-3 py-1.5 text-sm rounded-full border transition-all",
                          selectedSymptoms.includes(symptom) ? "bg-primary text-white border-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/30 hover:bg-primary/5",
                        )}
                      >
                        {symptom}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Additional Information (optional)</label>
            <textarea placeholder="Any other details you'd like to share (pre-existing conditions, medications, etc.)" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
            />
          </div>

          {selectedSymptoms.length > 0 && (
            <div className="mt-6 flex justify-end">
              <button onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Next: Health Context <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="card-standard p-6 md:p-8">
          <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white mb-2">Tell us more about your health</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This helps our AI provide a more accurate assessment.</p>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Age Range</label>
                <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">Select age range</option>
                  <option value="0-12">Child (0-12)</option>
                  <option value="13-17">Teenager (13-17)</option>
                  <option value="18-30">Young Adult (18-30)</option>
                  <option value="31-50">Adult (31-50)</option>
                  <option value="51-65">Middle-aged (51-65)</option>
                  <option value="65+">Senior (65+)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Duration of Symptoms</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">Select duration</option>
                  {SYMPTOM_DURATIONS.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Pre-existing Conditions (optional)</label>
                <input type="text" placeholder="e.g. diabetes, asthma" value={preExisting} onChange={(e) => setPreExisting(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Symptom Severity: <span className="text-primary font-semibold">{severity > 0 ? `${SEVERITY_LEVELS[severity].label}/10 — ${SEVERITY_LEVELS[severity].desc}` : "Not selected"}</span>
              </label>
              <div className="flex gap-1.5">
                {SEVERITY_LEVELS.map((s) => (
                  <button key={s.value} onClick={() => setSeverity(s.value)}
                    className={cn(
                      "flex-1 py-3 rounded-xl text-center text-xs font-bold border transition-all",
                      severity === s.value
                        ? s.value <= 3
                          ? "bg-green-500 text-white border-green-500"
                          : s.value <= 6
                            ? "bg-yellow-500 text-white border-yellow-500"
                            : s.value <= 8
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-red-500 text-white border-red-500"
                        : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary/30",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={handleAnalyze} disabled={analyzing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {analyzing ? <><LoadingSpinner size="sm" className="inline" /> Analyzing...</> : <><BrainCircuit className="w-4 h-4" /> Analyze Symptoms</>}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          {analyzing && (
            <div className="card-standard p-12 text-center">
              <LoadingSpinner size="lg" text="🤖 AI is analyzing your symptoms..." />
            </div>
          )}

          {!analyzing && analysisError && (
            <div className="card-standard p-8 text-center border-l-4 border-l-red-500">
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-2">Analysis Unavailable</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{analysisError}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Please try again or consult a healthcare professional.</p>
              <div className="flex justify-center gap-3">
                <button onClick={handleReset} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  Try Again
                </button>
                <Link href="/doctors" className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  Find a Doctor
                </Link>
              </div>
            </div>
          )}

          {!analyzing && !analysisError && results && (
            <>
              <div className={cn("card-standard p-6 md:p-8 border-l-4", URGENCY_CONFIG[results.urgency].border)}>
                <div className="flex items-start gap-4">
                  <div className={cn("p-3 rounded-2xl", URGENCY_CONFIG[results.urgency].bg)}>
                    {URGENCY_CONFIG[results.urgency].icon === "check"
                      ? <CheckCircle className={cn("w-6 h-6", URGENCY_CONFIG[results.urgency].color)} />
                      : <AlertTriangle className={cn("w-6 h-6", URGENCY_CONFIG[results.urgency].color)} />
                    }
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
                      Urgency Assessment: <span className={URGENCY_CONFIG[results.urgency].color}>{results.urgency}</span>
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{results.verdict}</p>
                  </div>
                </div>
              </div>

              {results.conditions.length > 0 && (
                <div className="card-standard p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Possible Conditions</h3>
                  <div className="space-y-4">
                    {results.conditions.map((condition, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-800 dark:text-slate-200 font-semibold">{condition.name}</span>
                          <span className="text-slate-500 font-medium">{condition.probability}% confidence</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{condition.description}</p>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", condition.color)} style={{ width: `${condition.probability}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card-standard p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" /> Recommendations
                  </h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" /> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="card-standard p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Warning Signs to Watch
                  </h3>
                  <ul className="space-y-2">
                    {results.warningSigns.map((sign, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" /> {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" /> Should You See a Doctor?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {results.shouldSeeDoctor ? (
                    <>
                      {results.urgency === "Critical"
                        ? "Your symptoms require immediate medical attention. Please visit an emergency room or urgent care center as soon as possible."
                        : "Your symptoms warrant a medical consultation. Please schedule an appointment with your healthcare provider within the next few days."}
                      {results.doctorType && ` Consider consulting a ${results.doctorType}.`}
                    </>
                  ) : (
                    "Your symptoms appear mild and likely resolve on their own. Monitor them and consult a doctor if they persist beyond a week or worsen."
                  )}
                </p>
              </div>

              {results.lifestyleAdvice.length > 0 && (
                <div className="card-standard p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Lifestyle Advice</h3>
                  <div className="flex flex-wrap gap-2">
                    {results.lifestyleAdvice.map((advice, i) => (
                      <span key={i} className="px-3 py-1.5 text-sm rounded-full bg-secondary/10 text-secondary border border-secondary/20">{advice}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Your Selected Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((s) => (
                    <span key={s} className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
                  ))}
                </div>
              </div>

              <div className="card-standard p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-3">Medical Disclaimer</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  This AI-powered analysis is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical decisions. Never disregard professional medical advice or delay in seeking it because of something you read here. In case of emergency, contact emergency services immediately.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Start Over
                </button>
                <button onClick={handleShare}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Share Results
                </button>
                <Link href="/conditions"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  View Related Conditions
                </Link>
                <Link href="/doctors"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Stethoscope className="w-4 h-4" /> Find Related Doctors
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
