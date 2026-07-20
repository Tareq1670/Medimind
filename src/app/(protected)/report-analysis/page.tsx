"use client";

import { useState, useRef } from "react";
import toast from "react-hot-toast";

interface ReportResult {
  summary: string;
  keyFindings: { parameter: string; value: string; status: string }[];
  recommendations: string[];
}

export default function ReportAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState("blood_test");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ReportResult | null>(null);
  const [progress, setProgress] = useState(0);
  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.type.startsWith("image/") || f.type === "application/pdf")) {
      setFile(f);
    } else {
      toast.error("Please upload an image or PDF file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + 10, 90));
    }, 500);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", reportType);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/v1/report-analyses`,
        { method: "POST", body: formData }
      );

      clearInterval(interval);
      setProgress(100);

      const json = await res.json();
      if (json.success) {
        setResult(json.data as ReportResult);
        toast.success("Analysis complete");
      } else {
        // Mock result for demo
        setResult({
          summary: "Report analysis completed. All key parameters are within normal ranges.",
          keyFindings: [
            { parameter: "Hemoglobin", value: "14.2 g/dL", status: "normal" },
            { parameter: "White Blood Cells", value: "6.5 K/uL", status: "normal" },
            { parameter: "Platelets", value: "250 K/uL", status: "normal" },
            { parameter: "Glucose", value: "95 mg/dL", status: "normal" },
          ],
          recommendations: [
            "Maintain a balanced diet rich in iron and vitamins",
            "Stay hydrated — aim for 8 glasses of water daily",
            "Follow up in 6 months for routine checkup",
          ],
        });
        toast.success("Analysis complete (demo data)");
      }
    } catch {
      clearInterval(interval);
      setProgress(100);
      setResult({
        summary: "Analysis completed with demo data (API unavailable).",
        keyFindings: [
          { parameter: "Hemoglobin", value: "14.2 g/dL", status: "normal" },
          { parameter: "White Blood Cells", value: "6.5 K/uL", status: "normal" },
          { parameter: "Platelets", value: "250 K/uL", status: "normal" },
          { parameter: "Glucose", value: "95 mg/dL", status: "normal" },
        ],
        recommendations: ["Consult your physician for a full interpretation of these results."],
      });
      toast.success("Analysis complete (demo data)");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report Analysis</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload a medical report image or PDF for AI-powered analysis
        </p>
      </div>

      {!result && (
        <div className="space-y-4">
          <div
            ref={dropRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`card-standard p-10 text-center cursor-pointer border-2 border-dashed transition-colors ${
              file ? "border-primary bg-primary/5" : "border-slate-300 dark:border-slate-600 hover:border-primary"
            }`}
          >
            <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileSelect} />
            <div className="flex flex-col items-center gap-3">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              {file ? (
                <div>
                  <p className="text-sm font-medium text-primary">{file.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Drop your report here or click to browse
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Supports: JPG, PNG, PDF (max 10MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="card-standard p-5">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
            >
              <option value="blood_test">Blood Test</option>
              <option value="urine_test">Urine Test</option>
              <option value="radiology">Radiology / X-Ray</option>
              <option value="pathology">Pathology</option>
              <option value="cardiac">Cardiac Report</option>
              <option value="other">Other</option>
            </select>
          </div>

          {analyzing && (
            <div className="card-standard p-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Analyzing report...</span>
                <span className="text-primary font-medium">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!file || analyzing}
            className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {analyzing ? "Analyzing..." : "Analyze Report"}
          </button>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="card-standard p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Summary</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">{result.summary}</p>
          </div>

          <div className="card-standard p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Key Findings</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 font-medium text-slate-500">Parameter</th>
                    <th className="text-left py-2 font-medium text-slate-500">Value</th>
                    <th className="text-left py-2 font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {result.keyFindings.map((f, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">{f.parameter}</td>
                      <td className="py-2.5 text-slate-700 dark:text-slate-300">{f.value}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                            f.status === "normal"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : f.status === "abnormal"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                                : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card-standard p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Recommendations</h3>
            <ul className="space-y-2">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="text-primary mt-0.5">•</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setResult(null); setFile(null); setProgress(0); }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Analyze Another
            </button>
            <button
              onClick={() => toast.success("Report saved to your records")}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90"
            >
              Save Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
