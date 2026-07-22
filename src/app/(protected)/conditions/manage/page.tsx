"use client";

import { useState, useEffect } from "react";
import { useConditions, useCreateCondition, useUpdateCondition, useDeleteCondition } from "@/hooks/useConditions";
import { TableSkeleton, EmptyState, Pagination, ActiveFilters } from "@/components/shared";
import { Search, AlertTriangle, X, Loader2, Plus } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { useURLFilters } from "@/hooks/useURLFilters";
import type { Condition } from "@/types";
import toast from "react-hot-toast";

const SEVERITY_OPTIONS = ["Low", "Medium", "High"];

const conditionFilters = {
  search: { debounce: 300 },
  severity: {},
} as const;

function ConditionTableRow({ condition, onEdit, onDelete }: {
  condition: Condition;
  onEdit: (c: Condition) => void;
  onDelete: (id: string) => void;
}) {
  const severityColor: Record<string, string> = {
    Low: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    Medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
    High: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
  };
  return (
    <tr className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{condition.title}</td>
      <td className="px-4 py-3">
        <span className={cn("px-2 py-0.5 text-[11px] font-medium rounded-full", severityColor[condition.severity])}>{condition.severity}</span>
      </td>
      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell max-w-xs truncate">{condition.symptoms?.slice(0, 3).join(", ")}</td>
      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden lg:table-cell max-w-xs truncate">{condition.description?.slice(0, 80)}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => onEdit(condition)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">Edit</button>
          <button onClick={() => onDelete(condition._id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
        </div>
      </td>
    </tr>
  );
}

export default function ManageConditionsPage() {
  const { filters: f, page, set, setMany, setPage, resetAll, activeFilterCount } = useURLFilters(conditionFilters);
  const [searchInput, setSearchInput] = useState(f.search);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { setSearchInput(f.search); }, [f.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== f.search) set("search", searchInput || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, f.search, set]);

  const search = f.search;
  const severity = f.severity;
  const [editCondition, setEditCondition] = useState<Condition | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const emptyForm = { title: "", description: "", symptoms: "", severity: "Low" as "Low" | "Medium" | "High", precautions: "" };
  const [addForm, setAddForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const filter = { search: search || undefined, severity: severity || undefined, page, limit: 20 };
  const { data, isLoading } = useConditions(filter);
  const createCondition = useCreateCondition();
  const updateCondition = useUpdateCondition();
  const deleteCondition = useDeleteCondition();
  const conditions = data?.data || [];

  const resetAddForm = () => { setAddForm(emptyForm); setShowAdd(false); };

  const handleAdd = async () => {
    if (!addForm.title || !addForm.description) { toast.error("Title and description are required"); return; }
    try {
      await createCondition.mutateAsync({
        title: addForm.title, description: addForm.description,
        symptoms: addForm.symptoms.split(",").map((s: string) => s.trim()).filter(Boolean),
        severity: addForm.severity as "Low" | "Medium" | "High",
        precautions: addForm.precautions.split(",").map((s: string) => s.trim()).filter(Boolean),
      });
      resetAddForm();
    } catch { /* handled */ }
  };

  const handleEdit = (c: Condition) => {
    setEditCondition(c);
    setEditForm({
      title: c.title, description: c.description,
      symptoms: c.symptoms?.join(", ") || "", severity: c.severity as "Low" | "Medium" | "High",
      precautions: c.precautions?.join(", ") || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editCondition) return;
    try {
      await updateCondition.mutateAsync({
        id: editCondition._id,
        data: {
          title: editForm.title, description: editForm.description,
          symptoms: editForm.symptoms.split(",").map((s: string) => s.trim()).filter(Boolean),
          severity: editForm.severity as "Low" | "Medium" | "High",
          precautions: editForm.precautions.split(",").map((s: string) => s.trim()).filter(Boolean),
        },
      });
      setEditCondition(null);
    } catch { /* handled */ }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteCondition.mutateAsync(deleteId); setDeleteId(null); } catch { /* handled */ }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Manage Conditions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data?.pagination?.total || 0} health conditions</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Condition
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search conditions..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search conditions"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <select value={severity} onChange={(e) => setMany({ severity: e.target.value || undefined })}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300"
        >
          <option value="">All Severities</option>
          {SEVERITY_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      <ActiveFilters
        totalCount={activeFilterCount}
        onClearAll={() => { resetAll(); setSearchInput(""); }}
        chips={[
          ...(search ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }] : []),
          ...(severity ? [{ key: "severity", label: "Severity", value: severity, onRemove: () => set("severity", undefined) }] : []),
        ]}
      />

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : conditions.length === 0 ? (
        <EmptyState icon={<AlertTriangle className="w-12 h-12" />} title="No conditions found" />
      ) : (
        <div className="card-standard overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Severity</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Symptoms</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden lg:table-cell">Description</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {conditions.map((c) => (
                  <ConditionTableRow key={c._id} condition={c} onEdit={handleEdit} onDelete={setDeleteId} />
                ))}
              </tbody>
            </table>
          </div>
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400">Page {page} of {data.pagination.totalPages}</p>
              <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={resetAddForm}>
          <div className="card-standard w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Add Condition</h2>
              <button onClick={resetAddForm} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input type="text" value={addForm.title} onChange={(e) => setAddForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Hypertension"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea value={addForm.description} onChange={(e) => setAddForm((p) => ({ ...p, description: e.target.value }))} rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Severity *</label>
                  <select value={addForm.severity} onChange={(e) => setAddForm((p) => ({ ...p, severity: e.target.value as "Low" | "Medium" | "High" }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {SEVERITY_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Symptoms (comma-separated)</label>
                <input type="text" value={addForm.symptoms} onChange={(e) => setAddForm((p) => ({ ...p, symptoms: e.target.value }))} placeholder="Headache, Fever, Fatigue"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Precautions (comma-separated)</label>
                <input type="text" value={addForm.precautions} onChange={(e) => setAddForm((p) => ({ ...p, precautions: e.target.value }))} placeholder="Rest, Hydrate, Consult doctor"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={resetAddForm} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleAdd} disabled={createCondition.isPending}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {createCondition.isPending ? <><Loader2 className="w-3 h-3 animate-spin" /> Creating...</> : "Create Condition"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editCondition && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditCondition(null)}>
          <div className="card-standard w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Edit Condition</h2>
              <button onClick={() => setEditCondition(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Severity</label>
                <select value={editForm.severity} onChange={(e) => setEditForm((p) => ({ ...p, severity: e.target.value as "Low" | "Medium" | "High" }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SEVERITY_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Symptoms (comma-separated)</label>
                <input type="text" value={editForm.symptoms} onChange={(e) => setEditForm((p) => ({ ...p, symptoms: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Precautions (comma-separated)</label>
                <input type="text" value={editForm.precautions} onChange={(e) => setEditForm((p) => ({ ...p, precautions: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditCondition(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleSaveEdit} disabled={updateCondition.isPending}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {updateCondition.isPending ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="card-standard w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-3" />
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Condition?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This will permanently remove this health condition.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleDelete} disabled={deleteCondition.isPending}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleteCondition.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
