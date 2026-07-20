"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/shared";
import { cn } from "@/lib/utils";
import { getJwtToken } from "@/lib/api";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1`;

interface ReportParameter {
  name: string;
  value: string;
  unit: string;
  range: string;
  status: "Normal" | "Low" | "High" | "Critical";
  explanation: string;
}

interface ReportResult {
  reportType: string;
  parameters: ReportParameter[];
  overallAssessment: string;
  followUpActions: string[];
  urgencyLevel: "routine" | "urgent" | "emergency";
  disclaimer: string;
}

const REPORT_TYPES = [
  { value: "blood_test", label: "Blood Test Report" },
  { value: "xray", label: "X-Ray / Scan" },
  { value: "prescription", label: "Prescription" },
  { value: "lab_report", label: "Lab Report" },
  { value: "medical_certificate", label: "Medical Certificate" },
  { value: "other", label: "Other" },
];

const URGENCY_STYLES = {
  routine: { label: "Routine", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30", border: "border-green-300 dark:border-green-700" },
  urgent: { label: "Urgent", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30", border: "border-orange-300 dark:border-orange-700" },
  emergency: { label: "Emergency", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30", border: "border-red-300 dark:border-red-700" },
};

const STATUS_STYLES: Record<string, { icon: string; color: string; bg: string }> = {
  Normal: { icon: "✅", color: "text-green-700 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" },
  Low: { icon: "⚠️", color: "text-yellow-700 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
  High: { icon: "🚨", color: "text-red-700 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" },
  Critical: { icon: "🚨", color: "text-red-700 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" },
};

export default function ReportAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState("blood_test");
  const [reportName, setReportName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.type.startsWith("image/") || f.type === "application/pdf")) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setFile(f);
    } else {
      toast.error("Please upload an image (JPG, PNG, WEBP) or PDF file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error("File size must be under 10MB");
        return;
      }
      setFile(f);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(0);
    setResult(null);
    setError(null);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 8, 90));
    }, 500);

    try {
      const token = await getJwtToken();
      if (!token) {
        throw new Error("You must be logged in to analyze reports");
      }

      const formData = new FormData();
      formData.append("reportImage", file);
      formData.append("reportType", reportType);
      if (reportName) formData.append("reportName", reportName);

      const res = await fetch(`${API_BASE}/ai/report-analysis`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(interval);
      setProgress(100);

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        const msg = errBody.message || `Analysis failed (${res.status})`;
        if (res.status === 401) throw new Error("Session expired. Please log in again.");
        if (res.status === 413) throw new Error("File is too large. Maximum size is 10MB.");
        throw new Error(msg);
      }

      const json = await res.json();
      if (json.success) {
        setResult(json.data as ReportResult);
        toast.success("Analysis complete");
      } else {
        throw new Error(json.message || "Analysis failed");
      }
    } catch (err) {
      clearInterval(interval);
      setProgress(100);
      const msg = err instanceof Error ? err.message : "Analysis failed";
      console.error("[report-analysis] Error:", msg);
      setError(msg);
      toast.error(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setReportType("blood_test");
    setReportName("");
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const handleSave = async () => {
    if (!result) return;
    try {
      const { post, get } = await import("@/lib/api");
      try {
        await get("/health-records");
      } catch {
        await post("/health-records", {
          chronicConditions: [],
          allergies: [],
          currentMedications: [],
        });
      }
      await post("/report-analyses", {
        reportType: result.reportType,
        reportName: reportName || undefined,
        analysisSummary: result.overallAssessment,
        aiAnalysis: {
          summary: result.overallAssessment,
          keyFindings: result.parameters.map((p) => `${p.name}: ${p.value} ${p.unit} (${p.status})`),
          recommendations: result.followUpActions,
          riskIndicators: result.parameters.filter((p) => p.status === "High" || p.status === "Critical").map((p) => `${p.name}: ${p.value}`),
          normalValues: Object.fromEntries(result.parameters.filter((p) => p.status === "Normal").map((p) => [p.name, p.value])),
          abnormalValues: Object.fromEntries(result.parameters.filter((p) => p.status !== "Normal").map((p) => [p.name, p.value])),
        },
      });
      toast.success("Report saved to your health records");
    } catch {
      toast.error("Failed to save report");
    }
  };

  const handleShare = () => {
    const text = `MediMind Report Analysis\nType: ${result?.reportType}\nAssessment: ${result?.overallAssessment}\nUrgency: ${result?.urgencyLevel}`;
    navigator.clipboard.writeText(text);
    toast.success("Report summary copied to clipboard");
  };

  const handleDownloadReport = () => {
    window.print();
  };

  const sortedParams = result?.parameters
    ? [...result.parameters].sort((a, b) => {
        const order = { Critical: 0, High: 1, Low: 2, Normal: 3 };
        return (order[a.status] ?? 4) - (order[b.status] ?? 4);
      })
    : [];

  return (
    <>
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-report, #printable-report * { visibility: visible !important; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; padding: 40px; background: white; color: black; }
          #printable-report table { width: 100%; border-collapse: collapse; }
          #printable-report th, #printable-report td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
          #printable-report th { background: #f1f5f9; font-weight: 600; }
          #printable-report .print-header { margin-bottom: 24px; border-bottom: 2px solid #14b8a6; padding-bottom: 16px; }
          #printable-report .print-header h1 { font-size: 20px; margin: 0 0 4px; }
          #printable-report .print-header p { font-size: 12px; color: #666; margin: 0; }
          #printable-report .print-section { margin-bottom: 20px; }
          #printable-report .print-section h2 { font-size: 14px; font-weight: 600; margin: 0 0 8px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
          #printable-report .urgency-badge { display: inline-block; padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          #printable-report .status-normal { background: #dcfce7; color: #166534; }
          #printable-report .status-low { background: #fef9c3; color: #854d0e; }
          #printable-report .status-high { background: #fee2e2; color: #991b1b; }
          #printable-report .status-critical { background: #fecaca; color: #991b1b; }
          #printable-report .disclaimer { font-size: 10px; color: #999; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 24px; }
        }
      `}</style>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Medical Report Analysis</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload a medical report for AI-powered analysis. Supported formats: JPG, PNG, WEBP, PDF (max 10MB).
          </p>
        </div>

        {!result && !analyzing && (
          <div className="space-y-4">
            <div
              ref={dropRef}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={cn(
                "card-standard p-12 text-center cursor-pointer border-2 border-dashed transition-colors",
                file ? "border-primary bg-primary/5" : "border-slate-300 dark:border-slate-600 hover:border-primary"
              )}
            >
              <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileSelect} />
              <div className="flex flex-col items-center gap-3">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {file ? (
                  <div>
                    <p className="text-sm font-medium text-primary">{file.name}</p>
                    <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="mt-2 text-xs text-red-500 hover:text-red-600">Remove file</button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Drop your report here or click to browse
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Supports: JPG, PNG, WEBP, PDF (max 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card-standard p-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Report Type *</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white"
                >
                  {REPORT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div className="card-standard p-5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Report Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Annual Blood Work 2024"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {analyzing ? "Analyzing with AI Vision..." : "Analyze Report"}
            </button>
          </div>
        )}

        {analyzing && (
          <div className="card-standard p-8 space-y-4">
            <LoadingSpinner size="lg" text="Analyzing with AI Vision..." />
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-500 dark:text-slate-400">Processing report...</span>
                <span className="text-primary font-medium">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">Estimated time: ~10-15 seconds</p>
            </div>
          </div>
        )}

        {result && !analyzing && (
          <div className="space-y-6">
            {error && (
              <div className="card-standard p-4 border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</p>
                <p className="text-xs text-red-500 dark:text-red-400 mt-1">The results below may be incomplete. Please try uploading a clearer image or try again later.</p>
              </div>
            )}

            <div className={cn("card-standard p-4 border-l-4", result.urgencyLevel === "emergency" ? "border-l-red-500" : result.urgencyLevel === "urgent" ? "border-l-orange-500" : "border-l-green-500")}>
              <div className="flex items-center gap-3">
                <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase", URGENCY_STYLES[result.urgencyLevel].bg, URGENCY_STYLES[result.urgencyLevel].color)}>
                  {URGENCY_STYLES[result.urgencyLevel].label}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">Urgency Level</span>
              </div>
            </div>

            <div className="card-standard p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Report Summary</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{result.overallAssessment}</p>
            </div>

            {sortedParams.length > 0 && (
              <div className="card-standard p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Findings</h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {(["Normal", "Low", "High", "Critical"] as const).map((status) => {
                    const count = sortedParams.filter((p) => p.status === status).length;
                    if (count === 0) return null;
                    return (
                      <span key={status} className={cn("px-3 py-1 rounded-full text-xs font-medium", STATUS_STYLES[status].bg, STATUS_STYLES[status].color)}>
                        {STATUS_STYLES[status].icon} {count} {status}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {sortedParams.length > 0 && (
              <div className="card-standard p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Detailed Parameter Analysis</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-2 font-medium text-slate-500">Parameter</th>
                        <th className="text-left py-2 font-medium text-slate-500">Value</th>
                        <th className="text-left py-2 font-medium text-slate-500">Reference Range</th>
                        <th className="text-left py-2 font-medium text-slate-500">Status</th>
                        <th className="text-left py-2 font-medium text-slate-500">Explanation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedParams.map((p, i) => (
                        <tr key={i} className={cn("border-b border-slate-100 dark:border-slate-800", STATUS_STYLES[p.status]?.bg)}>
                          <td className="py-3 text-slate-700 dark:text-slate-300 font-medium">{p.name}</td>
                          <td className="py-3 text-slate-700 dark:text-slate-300">{p.value} {p.unit}</td>
                          <td className="py-3 text-slate-500 dark:text-slate-400">{p.range}</td>
                          <td className="py-3">
                            <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full", STATUS_STYLES[p.status]?.bg, STATUS_STYLES[p.status]?.color)}>
                              {STATUS_STYLES[p.status]?.icon} {p.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500 dark:text-slate-400 text-xs max-w-xs">{p.explanation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {result.followUpActions.length > 0 && (
              <div className="card-standard p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">AI Recommendations</h3>
                <ul className="space-y-2">
                  {result.followUpActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <span className="text-primary mt-0.5">•</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card-standard p-4">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong>Disclaimer:</strong> This AI-powered analysis is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical decisions. Results may not be fully accurate — a professional review is recommended.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleReset}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Start New Analysis
              </button>
              <button
                onClick={handleDownloadReport}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Download Report (PDF)
              </button>
              <button
                onClick={handleSave}
                className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                Save to Records
              </button>
              <button
                onClick={handleShare}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Share Results
              </button>
            </div>
          </div>
        )}
      </div>

      <div id="printable-report" ref={printRef}>
        {result && (
          <>
            <div className="print-header">
              <h1>MediMind Medical Report Analysis</h1>
              <p>Report Type: {REPORT_TYPES.find((t) => t.value === result.reportType)?.label || result.reportType}</p>
              {reportName && <p>Report Name: {reportName}</p>}
              <p>Generated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            <div className="print-section">
              <h2>Urgency Level</h2>
              <span className={`urgency-badge ${result.urgencyLevel === "emergency" ? "status-critical" : result.urgencyLevel === "urgent" ? "status-low" : "status-normal"}`}>
                {URGENCY_STYLES[result.urgencyLevel].label}
              </span>
            </div>

            <div className="print-section">
              <h2>Overall Assessment</h2>
              <p>{result.overallAssessment}</p>
            </div>

            {sortedParams.length > 0 && (
              <div className="print-section">
                <h2>Parameter Analysis</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Value</th>
                      <th>Reference Range</th>
                      <th>Status</th>
                      <th>Explanation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedParams.map((p, i) => (
                      <tr key={i}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.value} {p.unit}</td>
                        <td>{p.range}</td>
                        <td><span className={`status-${p.status.toLowerCase()}`}>{p.status}</span></td>
                        <td>{p.explanation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {result.followUpActions.length > 0 && (
              <div className="print-section">
                <h2>AI Recommendations</h2>
                <ul>
                  {result.followUpActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="disclaimer">
              <strong>Disclaimer:</strong> This AI-powered analysis is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider. Generated by MediMind AI.
            </div>
          </>
        )}
      </div>
    </>
  );
}
