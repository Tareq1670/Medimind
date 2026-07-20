"use client";

import { useHealthRecords, useAddHealthRecord, useDeleteHealthRecord } from "@/hooks/useHealthRecords";
import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type RecordType = "blood_pressure" | "heart_rate" | "blood_sugar" | "weight" | "temperature" | "other";

const typeOptions: { value: RecordType; label: string; unit: string }[] = [
  { value: "blood_pressure", label: "Blood Pressure", unit: "mmHg" },
  { value: "heart_rate", label: "Heart Rate", unit: "bpm" },
  { value: "blood_sugar", label: "Blood Sugar", unit: "mg/dL" },
  { value: "weight", label: "Weight", unit: "kg" },
  { value: "temperature", label: "Temperature", unit: "°F" },
  { value: "other", label: "Other", unit: "" },
];

export default function HealthRecordsPage() {
  const { data: records, isLoading } = useHealthRecords();
  const addRecord = useAddHealthRecord();
  const deleteRecord = useDeleteHealthRecord();
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    type: "blood_pressure" as RecordType,
    value: "",
    unit: "mmHg",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleTypeChange = (type: RecordType) => {
    const opt = typeOptions.find((o) => o.value === type);
    setForm({ ...form, type, unit: opt?.unit || "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRecord.mutateAsync(form);
    setForm({ type: "blood_pressure", value: "", unit: "mmHg", date: new Date().toISOString().split("T")[0], notes: "" });
    setShowForm(false);
  };

  const chartData = (records || [])
    .filter((r) => r.type !== "other")
    .slice(-20)
    .map((r) => ({ date: r.date?.slice(5, 10) || r.createdAt?.slice(5, 10), value: parseFloat(r.value) || 0, type: r.type }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Health Records</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your vitals and health data</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          {showForm ? "Cancel" : "Add Record"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card-standard p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => handleTypeChange(e.target.value as RecordType)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
              >
                {typeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Value</label>
              <input
                type="text"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                required
                placeholder="e.g. 120"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any additional notes"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={addRecord.isPending}
            className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {addRecord.isPending ? "Saving..." : "Save Record"}
          </button>
        </form>
      )}

      {chartData.length > 0 && (
        <div className="card-standard p-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-standard p-4 animate-pulse">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-48 bg-slate-200 dark:bg-slate-700 rounded mt-2" />
            </div>
          ))}
        </div>
      ) : records && records.length > 0 ? (
        <div className="space-y-3">
          {records.map((r) => (
            <div key={r._id} className="card-standard p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                  {r.type.replace("_", " ")}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {r.value} {r.unit} &middot; {new Date(r.date || r.createdAt).toLocaleDateString()}
                </p>
                {r.notes && <p className="text-xs text-slate-400 mt-1">{r.notes}</p>}
              </div>
              <button
                onClick={() => deleteRecord.mutate(r._id)}
                className="text-red-400 hover:text-red-600 text-xs font-medium"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-standard p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400">No health records yet.</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Click &quot;Add Record&quot; to start tracking.</p>
        </div>
      )}
    </div>
  );
}
