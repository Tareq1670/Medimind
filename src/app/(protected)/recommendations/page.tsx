"use client";

import { useState, useEffect } from "react";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useAiRecommendations } from "@/hooks/useAI";
import { COMMON_SYMPTOMS } from "@/constants/symptoms.constants";
import { Loader2 } from "@/lib/icon-map";
import toast from "react-hot-toast";

interface RecommendationSession {
  id: string;
  timestamp: number;
  inputs: { symptoms: string[]; conditions: string[]; healthGoals: string };
  results: {
    recommendations: { name: string; type: string; reason: string; priority: string }[];
    itemsToAvoid: { name: string; reason: string }[];
    lifestyleTips: string[];
    monitoringSuggestions: string[];
    disclaimer: string;
  };
}

const STORAGE_KEY = "medimind_recommendations";
const MAX_HISTORY = 5;

function loadHistory(): RecommendationSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(sessions: RecommendationSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_HISTORY)));
}

export default function RecommendationsPage() {
  const { data: healthRecord } = useHealthRecords();
  const getRecommendations = useAiRecommendations();

  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [healthGoals, setHealthGoals] = useState("");
  const [symptomSearch, setSymptomSearch] = useState("");
  const [customCondition, setCustomCondition] = useState("");
  const [history, setHistory] = useState<RecommendationSession[]>([]);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (healthRecord) {
      if (healthRecord.chronicConditions?.length) {
        setConditions((prev) => [...new Set([...prev, ...healthRecord.chronicConditions])]);
      }
    }
  }, [healthRecord]);

  const filteredSymptoms = COMMON_SYMPTOMS.filter(
    (s) => s.toLowerCase().includes(symptomSearch.toLowerCase()) && !symptoms.includes(s)
  );

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  };

  const addCondition = () => {
    const v = customCondition.trim();
    if (v && !conditions.includes(v)) {
      setConditions((prev) => [...prev, v]);
      setCustomCondition("");
    }
  };

  const handleGetRecommendations = async () => {
    if (!symptoms.length && !conditions.length && !healthGoals.trim()) {
      toast.error("Please enter at least one symptom, condition, or health goal");
      return;
    }
    try {
      const result = await getRecommendations.mutateAsync({
        symptoms: symptoms.length ? symptoms : undefined,
        conditions: conditions.length ? conditions : undefined,
        healthGoals: healthGoals.trim() ? [healthGoals.trim()] : undefined,
      });
      const session: RecommendationSession = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        inputs: { symptoms: [...symptoms], conditions: [...conditions], healthGoals },
        results: result,
      };
      const updated = [session, ...history];
      setHistory(updated);
      saveHistory(updated);
      toast.success("Recommendations generated!");
    } catch {
      // error toast handled by hook
    }
  };

  const result = getRecommendations.data;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Recommendations</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Get personalized medicine and health recommendations based on your symptoms and health profile.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-standard p-6 space-y-5">
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Your Health Input</h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Symptoms</label>
              <input
                type="text"
                placeholder="Search symptoms..."
                value={symptomSearch}
                onChange={(e) => setSymptomSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 mb-2"
              />
              {symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {symptoms.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {s}
                      <button onClick={() => toggleSymptom(s)} className="hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {filteredSymptoms.slice(0, 20).map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSymptom(s)}
                    className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Health Conditions</label>
              {conditions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {conditions.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                      {c}
                      <button onClick={() => setConditions((prev) => prev.filter((x) => x !== c))} className="hover:text-red-500">&times;</button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a condition..."
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCondition(); } }}
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button onClick={addCondition} className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  Add
                </button>
              </div>
              {healthRecord?.chronicConditions?.length ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Auto-filled from your health record. You can add more above.</p>
              ) : null}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Health Goals</label>
              <textarea
                value={healthGoals}
                onChange={(e) => setHealthGoals(e.target.value)}
                rows={2}
                placeholder="e.g. Improve sleep quality, manage weight, reduce stress..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>

            <button
              onClick={handleGetRecommendations}
              disabled={getRecommendations.isPending || (!symptoms.length && !conditions.length && !healthGoals.trim())}
              className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {getRecommendations.isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Recommendations...
                </span>
              ) : (
                "Get AI Recommendations"
              )}
            </button>
          </div>

          {result && (
            <div className="space-y-5">
              {result.recommendations?.length > 0 && (
                <div className="card-standard p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Recommended Medicines & Supplements</h3>
                  <div className="space-y-3">
                    {result.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary text-lg">
                            {rec.type === "supplement" ? "💊" : rec.type === "medicine" ? "💉" : "🌿"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-slate-900 dark:text-white text-sm">{rec.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              rec.priority === "high" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" :
                              rec.priority === "medium" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
                              "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            }`}>
                              {rec.priority}
                            </span>
                            <span className="text-xs text-slate-400">{rec.type}</span>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{rec.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.itemsToAvoid?.length > 0 && (
                <div className="card-standard p-6 border-l-4 border-l-red-500">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Items to Avoid</h3>
                  <div className="space-y-2">
                    {result.itemsToAvoid.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-red-500 mt-0.5">⚠</span>
                        <div>
                          <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                          <span className="text-slate-500 dark:text-slate-400 ml-2">— {item.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.lifestyleTips?.length > 0 && (
                <div className="card-standard p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Lifestyle Tips</h3>
                  <ul className="space-y-2">
                    {result.lifestyleTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-primary mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.monitoringSuggestions?.length > 0 && (
                <div className="card-standard p-6">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-4">Monitoring Suggestions</h3>
                  <ul className="space-y-2">
                    {result.monitoringSuggestions.map((s, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center shrink-0">☐</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.disclaimer && (
                <div className="card-standard p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong>Disclaimer:</strong> {result.disclaimer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card-standard p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Recent Sessions</h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500">No previous recommendations yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setExpandedHistory(expandedHistory === h.id ? null : h.id)}
                    className="w-full text-left p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        {new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-xs text-primary">{h.results.recommendations?.length || 0} recs</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {h.inputs.symptoms.slice(0, 3).map((s) => (
                        <span key={s} className="px-1.5 py-0.5 rounded bg-primary/10 text-[10px] text-primary">{s}</span>
                      ))}
                      {h.inputs.symptoms.length > 3 && (
                        <span className="text-[10px] text-slate-400">+{h.inputs.symptoms.length - 3}</span>
                      )}
                    </div>
                    {expandedHistory === h.id && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        {h.results.recommendations?.slice(0, 3).map((rec, i) => (
                          <p key={i} className="text-[10px] text-slate-500">{rec.name}: {rec.reason?.slice(0, 60)}...</p>
                        ))}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card-standard p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Select your current symptoms for more accurate recommendations</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Your health conditions are auto-loaded from your profile</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Add health goals for personalized lifestyle advice</li>
              <li className="flex items-start gap-2"><span className="text-primary">•</span> Previous sessions are saved locally for quick reference</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
