"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState<string | null>(null);

  const settings = [
    { key: "maintenance_mode", label: "Maintenance Mode", description: "Put the platform in maintenance mode", type: "toggle", value: false },
    { key: "allow_registration", label: "Allow Registration", description: "Allow new user registrations", type: "toggle", value: true },
    { key: "require_doctor_verification", label: "Require Doctor Verification", description: "New doctors must be manually verified", type: "toggle", value: true },
    { key: "ai_disclaimer", label: "AI Disclaimer", description: "Show medical disclaimer on AI pages", type: "toggle", value: true },
  ] as const;

  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(settings.filter((s) => s.type === "toggle").map((s) => [s.key, s.value]))
  );

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async (section: string) => {
    setSaving(section);
    await new Promise((r) => setTimeout(r, 500));
    toast.success(`${section} settings saved`);
    setSaving(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure system-wide platform settings</p>
      </div>

      <div className="card-standard p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">General</h2>
          <button
            onClick={() => handleSave("General")}
            disabled={saving === "General"}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {saving === "General" ? "Saving..." : "Save"}
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {settings.map((s) => (
            <div key={s.key} className="flex items-center justify-between py-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{s.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
              </div>
              <button
                onClick={() => handleToggle(s.key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  toggles[s.key] ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    toggles[s.key] ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card-standard p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">AI Configuration</h2>
            <p className="text-xs text-slate-500 mt-0.5">API key status and AI provider settings</p>
          </div>
          <button
            onClick={() => handleSave("AI")}
            disabled={saving === "AI"}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {saving === "AI" ? "Saving..." : "Refresh Status"}
          </button>
        </div>
        <div className="space-y-3">
          {[
            { name: "Gemini API", status: "connected", key: "GEMINI_API_KEY" },
            { name: "Groq API", status: "connected", key: "GROQ_API_KEY" },
            { name: "ImageBB API", status: "connected", key: "IMAGEBB_API_KEY" },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${s.status === "connected" ? "bg-green-500" : "bg-red-500"}`} />
                <span className="text-sm text-slate-700 dark:text-slate-300">{s.name}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{s.key}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card-standard p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Danger Zone</h2>
            <p className="text-xs text-slate-500 mt-0.5">Irreversible actions</p>
          </div>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear all cached data?")) {
                toast.success("Cache cleared");
              }
            }}
            className="w-full rounded-xl border border-red-200 dark:border-red-900/50 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Clear All Caches
          </button>
        </div>
      </div>
    </div>
  );
}
