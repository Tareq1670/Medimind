"use client";

import { useState } from "react";
import Link from "next/link";
import { useMedicines, useDeleteMedicine, useUpdateMedicine } from "@/hooks/useMedicines";
import { LoadingSpinner, EmptyState } from "@/components/shared";
import { Pill, Search, Plus, AlertTriangle, X, Loader2 } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { MEDICINE_CATEGORIES } from "@/constants";
import type { Medicine } from "@/types";

const PAGE_SIZE = 20;

export default function ManageMedicinesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const [editMedicine, setEditMedicine] = useState<Medicine | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", genericName: "", manufacturer: "", category: "", price: "", description: "", isPrescriptionRequired: false });

  const filter = { search: search || undefined, category: category || undefined, page, limit: PAGE_SIZE };
  const { data, isLoading } = useMedicines(filter);
  const deleteMedicine = useDeleteMedicine();
  const updateMedicine = useUpdateMedicine();
  const medicines = data?.data || [];

  const handleEdit = (m: Medicine) => {
    setEditMedicine(m);
    setEditForm({
      name: m.name, genericName: m.genericName, manufacturer: m.manufacturer,
      category: m.category, price: String(m.price), description: m.description || "",
      isPrescriptionRequired: m.isPrescriptionRequired,
    });
  };

  const handleSaveEdit = async () => {
    if (!editMedicine) return;
    try {
      await updateMedicine.mutateAsync({
        id: editMedicine._id,
        data: {
          name: editForm.name,
          genericName: editForm.genericName,
          manufacturer: editForm.manufacturer,
          category: editForm.category,
          price: Number(editForm.price),
          description: editForm.description,
          isPrescriptionRequired: editForm.isPrescriptionRequired,
        },
      });
      setEditMedicine(null);
    } catch { /* handled by hook */ }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMedicine.mutateAsync(deleteId);
      setDeleteId(null);
    } catch { /* handled by hook */ }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Manage Medicines</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data?.pagination?.total || 0} medicines in database</p>
        </div>
        <Link href="/medicines/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Medicine
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search medicines..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300"
        >
          <option value="">All Categories</option>
          {MEDICINE_CATEGORIES.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300"
        >
          <option value="">All Stock</option>
          <option value="low">Low Stock (&lt;10)</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-20" text="Loading medicines..." />
      ) : medicines.length === 0 ? (
        <EmptyState icon={<Pill className="w-12 h-12" />} title="No medicines found"
          description={search || category ? "Try adjusting your filters." : "No medicines in the database yet."}
          action={!search && !category ? <Link href="/medicines/add" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium">Add Medicine</Link> : undefined}
        />
      ) : (
        <div className="card-standard overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Image</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Stock</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((m) => (
                  <tr key={m._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 overflow-hidden flex items-center justify-center">
                        {m.image ? <img src={m.image} alt="" className="w-full h-full object-cover" /> : <Pill className="w-5 h-5 text-primary/40" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white">{m.name}</p>
                      <p className="text-xs text-slate-400">{m.genericName}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary/10 text-primary">{m.category}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">${m.price?.toFixed(2)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                        <span className={cn("text-xs font-medium", m.stockQuantity !== undefined && m.stockQuantity < 10 ? "text-red-500" : "text-green-600")}>
                          {m.stockQuantity !== undefined ? `${m.stockQuantity} units` : "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/medicines/${m._id}`} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View</Link>
                        <button onClick={() => handleEdit(m)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">Edit</button>
                        <button onClick={() => setDeleteId(m._id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400">Page {page} of {data.pagination.totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >Previous</button>
                <button onClick={() => setPage((p) => p + 1)} disabled={page >= data.pagination.totalPages}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40"
                >Next</button>
              </div>
            </div>
          )}
        </div>
      )}

      {editMedicine && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditMedicine(null)}>
          <div className="card-standard w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Edit Medicine</h2>
              <button onClick={() => setEditMedicine(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {(["name", "genericName", "manufacturer"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 capitalize">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input type="text" value={editForm[field]} onChange={(e) => setEditForm((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {MEDICINE_CATEGORIES.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price</label>
                <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="rx-edit" checked={editForm.isPrescriptionRequired} onChange={(e) => setEditForm((p) => ({ ...p, isPrescriptionRequired: e.target.checked }))}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                <label htmlFor="rx-edit" className="text-sm text-slate-700 dark:text-slate-300">Prescription Required</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditMedicine(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleSaveEdit} disabled={updateMedicine.isPending}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {updateMedicine.isPending ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="card-standard w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-3" />
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Medicine?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action cannot be undone. The medicine will be permanently removed.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleDelete} disabled={deleteMedicine.isPending}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleteMedicine.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
