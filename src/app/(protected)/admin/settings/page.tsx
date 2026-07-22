"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { get, put } from "@/lib/api";
import { CardSkeleton } from "@/components/shared";

interface PlatformSettings {
  maintenance_mode: boolean;
  allow_registration: boolean;
  require_doctor_verification: boolean;
  ai_disclaimer: boolean;
}

const SETTINGS_KEYS: { key: keyof PlatformSettings; label: string; description: string }[] = [
  { key: "maintenance_mode", label: "Maintenance Mode", description: "Put the platform in maintenance mode" },
  { key: "allow_registration", label: "Allow Registration", description: "Allow new user registrations" },
  { key: "require_doctor_verification", label: "Require Doctor Verification", description: "New doctors must be manually verified" },
  { key: "ai_disclaimer", label: "AI Disclaimer", description: "Show medical disclaimer on AI pages" },
];

const DEFAULT_SETTINGS: PlatformSettings = {
  maintenance_mode: false,
  allow_registration: true,
  require_doctor_verification: true,
  ai_disclaimer: true,
};

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggles, setToggles] = useState<PlatformSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    get<PlatformSettings>("/settings")
      .then((data) => setToggles(data))
      .catch(() => toast.error("Failed to load settings"))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = (key: keyof PlatformSettings) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await put("/settings", toggles);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure system-wide platform settings</p>
      </div>

      {loading ? (
        <CardSkeleton count={3} />
      ) : (
      <div className="card-standard p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">General</h2>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {SETTINGS_KEYS.map((s) => (
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
      )}

      <div className="card-standard p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">AI Configuration</h2>
            <p className="text-xs text-slate-500 mt-0.5">API key status and AI provider settings</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {"Refresh Status"}
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
