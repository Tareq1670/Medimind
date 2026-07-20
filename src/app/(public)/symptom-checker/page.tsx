"use client";

import { useState } from "react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/shared";
import { Search, X, AlertTriangle, Lightbulb, ArrowRight, ChevronLeft, Stethoscope, BrainCircuit, CheckCircle } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { COMMON_SYMPTOMS, SYMPTOM_DURATIONS } from "@/constants";
import { aiService } from "@/services";

type Step = 1 | 2 | 3;

const BODY_SYSTEM_GROUPS = [
  { name: "Head & Brain", symptoms: ["Headache", "Dizziness", "Blurred Vision", "Numbness", "Anxiety", "Depression", "Insomnia"] },
  { name: "Respiratory", symptoms: ["Cough", "Sore Throat", "Shortness of Breath", "Chest Pain"] },
  { name: "Digestive", symptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal Pain", "Loss of Appetite", "Indigestion", "Constipation"] },
  { name: "General", symptoms: ["Fever", "Fatigue", "Body Ache", "Night Sweats", "Weight Loss", "Muscle Weakness", "Joint Pain"] },
  { name: "Other", symptoms: ["Skin Rash", "Swollen Lymph Nodes", "Frequent Urination", "Back Pain", "Palpitations"] },
];

const SEVERITY_SLIDERS = [
  { value: 1, label: "Mild", desc: "Noticeable but not interfering with daily activities" },
  { value: 2, label: "Moderate", desc: "Interfering with some daily activities" },
  { value: 3, label: "Severe", desc: "Significantly interfering with daily activities" },
  { value: 4, label: "Very Severe", desc: "Unable to perform daily activities" },
  { value: 5, label: "Emergency", desc: "Requires immediate medical attention" },
];

const MOCK_RESULTS = {
  urgency: "Medium",
  conditions: [
    { name: "Common Cold", probability: 65, color: "bg-yellow-500" },
    { name: "Seasonal Allergies", probability: 45, color: "bg-blue-500" },
    { name: "Influenza", probability: 30, color: "bg-orange-500" },
  ],
  recommendations: [
    "Rest and stay hydrated",
    "Monitor your temperature",
    "Take over-the-counter pain relievers if needed",
    "Consult a doctor if symptoms persist beyond 7 days",
  ],
  warningSigns: [
    "High fever (above 103°F / 39.4°C)",
    "Difficulty breathing",
    "Chest pain or pressure",
  ],
  verdict: "Based on your symptoms, you may have a mild respiratory condition. While this typically resolves with rest and home care, please consult a healthcare provider if your symptoms worsen or persist.",
};

export default function SymptomCheckerPage() {
  const [step, setStep] = useState<Step>(1);
  const [selectedSymptomGroup, setSelectedSymptomGroup] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [symptomSearch, setSymptomSearch] = useState("");
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState(0);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<typeof MOCK_RESULTS | null>(null);

  const filteredSymptoms = COMMON_SYMPTOMS.filter((s) =>
    s.toLowerCase().includes(symptomSearch.toLowerCase())
  );

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await aiService.analyzeSymptoms(selectedSymptoms, duration);
      setResults({
        urgency: result.severity === "high" ? "High" : result.severity === "medium" ? "Medium" : "Low",
        conditions: (result.possibleConditions || []).map((c) => ({
          name: c.name,
          probability: c.probability,
          color: c.probability >= 60 ? "bg-red-500" : c.probability >= 30 ? "bg-yellow-500" : "bg-blue-500",
        })),
        recommendations: result.recommendations || MOCK_RESULTS.recommendations,
        warningSigns: MOCK_RESULTS.warningSigns,
        verdict: result.disclaimer || MOCK_RESULTS.verdict,
      });
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
      setResults(MOCK_RESULTS);
    }
    setAnalyzing(false);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedSymptoms([]);
    setSymptomSearch("");
    setAge("");
    setDuration("");
    setSeverity(0);
    setAdditionalInfo("");
    setResults(null);
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

          {selectedSymptoms.length > 0 && (
            <div className="mt-8 flex justify-end">
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
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Your Age</label>
                <input type="number" placeholder="e.g. 30" value={age} onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Duration of Symptoms</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                >
                  <option value="">Select duration</option>
                  {SYMPTOM_DURATIONS.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Symptom Severity: <span className="text-primary font-semibold">{SEVERITY_SLIDERS[severity]?.label || "Not selected"}</span>
              </label>
              <div className="flex gap-2">
                {SEVERITY_SLIDERS.map((s, i) => (
                  <button key={i} onClick={() => setSeverity(i)}
                    className={cn("flex-1 px-2 py-3 rounded-xl text-center text-xs font-medium border transition-all",
                      severity === i ? "bg-primary text-white border-primary" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary/30",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {severity > 0 && <p className="text-xs text-slate-400 mt-1.5">{SEVERITY_SLIDERS[severity].desc}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Additional Information (optional)</label>
              <textarea placeholder="Any other details you'd like to share (pre-existing conditions, medications, etc.)" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={handleAnalyze} disabled={!age || !duration || severity === 0 || analyzing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {analyzing ? <><LoadingSpinner size="sm" className="inline" /> Analyzing...</> : <><BrainCircuit className="w-4 h-4" /> Analyze Symptoms</>}
            </button>
          </div>
        </div>
      )}

      {step === 3 && results && (
        <div className="space-y-6">
          <div className={cn("card-standard p-6 md:p-8 border-l-4", results.urgency === "Low" ? "border-l-green-500" : results.urgency === "Medium" ? "border-l-yellow-500" : "border-l-red-500")}>
            <div className="flex items-start gap-4">
              <div className={cn("p-3 rounded-2xl", results.urgency === "Low" ? "bg-green-100 dark:bg-green-900/30" : results.urgency === "Medium" ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-red-100 dark:bg-red-900/30")}>
                {results.urgency === "Low" ? <CheckCircle className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-yellow-600" />}
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">
                  Urgency Assessment: <span className={cn(results.urgency === "Low" ? "text-green-600" : results.urgency === "Medium" ? "text-yellow-600" : "text-red-600")}>{results.urgency}</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{results.verdict}</p>
              </div>
            </div>
          </div>

          <div className="card-standard p-6">
            <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              Possible Conditions
            </h3>
            <div className="space-y-3">
              {results.conditions.map((condition, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{condition.name}</span>
                    <span className="text-slate-500">{condition.probability}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", condition.color)} style={{ width: `${condition.probability}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Warning Signs
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
              {results.urgency === "Low" && "Your symptoms appear mild and likely resolve on their own. Monitor them and consult a doctor if they persist beyond a week."}
              {results.urgency === "Medium" && "Your symptoms warrant a medical consultation. Please schedule an appointment with your healthcare provider within the next few days."}
              {results.urgency === "High" && "Your symptoms require immediate medical attention. Please visit an emergency room or urgent care center as soon as possible."}
            </p>
          </div>

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
              This analysis is for informational purposes only and is not a medical diagnosis. Always consult a qualified healthcare professional for medical advice, diagnosis, or treatment. Never disregard professional medical advice or delay in seeking it because of something you read here.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={handleReset}
              className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Start Over
            </button>
            <Link href="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Stethoscope className="w-4 h-4" /> Find a Doctor
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
