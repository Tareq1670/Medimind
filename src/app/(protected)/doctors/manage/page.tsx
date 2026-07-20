"use client";

import { useState } from "react";
import Link from "next/link";
import { useAllDoctors, useDeleteDoctor, useUpdateDoctor } from "@/hooks/useDoctorsList";
import { LoadingSpinner, EmptyState } from "@/components/shared";
import { Stethoscope, Search, X, Loader2, AlertTriangle } from "@/lib/icon-map";
import type { Doctor } from "@/types";

const SPECIALTIES = [
  "", "Cardiology", "Neurology", "Dermatology", "Pediatrics", "Orthopedics",
  "Ophthalmology", "Gynecology", "Psychiatry", "General Medicine", "ENT",
  "Gastroenterology", "Pulmonology", "Endocrinology",
];

export default function ManageDoctorsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [editDoctor, setEditDoctor] = useState<Doctor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ specialty: "", consultationFee: "", hospitalAffiliation: "", experienceYears: "", bio: "" });

  const filter = { search: search || undefined, specialty: specialty || undefined, page, limit: 20 };
  const { data, isLoading } = useAllDoctors(filter);
  const deleteDoctor = useDeleteDoctor();
  const updateDoctor = useUpdateDoctor();
  const doctors = data?.data || [];

  const handleEdit = (d: Doctor) => {
    setEditDoctor(d);
    setEditForm({
      specialty: d.specialty, consultationFee: String(d.consultationFee),
      hospitalAffiliation: d.hospitalAffiliation, experienceYears: String(d.experienceYears), bio: d.bio || "",
    });
  };

  const handleSaveEdit = async () => {
    if (!editDoctor) return;
    try {
      await updateDoctor.mutateAsync({
        id: editDoctor._id,
        data: {
          specialty: editForm.specialty,
          consultationFee: Number(editForm.consultationFee),
          hospitalAffiliation: editForm.hospitalAffiliation,
          experienceYears: Number(editForm.experienceYears),
          bio: editForm.bio,
        },
      });
      setEditDoctor(null);
    } catch { /* handled */ }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteDoctor.mutateAsync(deleteId); setDeleteId(null); } catch { /* handled */ }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Manage Doctors</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data?.pagination?.total || 0} doctors in the system</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search doctors..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <select value={specialty} onChange={(e) => { setSpecialty(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300"
        >
          <option value="">All Specialties</option>
          {SPECIALTIES.filter(Boolean).map((s) => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner className="py-20" text="Loading doctors..." />
      ) : doctors.length === 0 ? (
        <EmptyState icon={<Stethoscope className="w-12 h-12" />} title="No doctors found"
          description={search || specialty ? "Try adjusting your filters." : "No doctors in the system yet."}
        />
      ) : (
        <div className="card-standard overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Specialty</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Hospital</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Fee</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Experience</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((d) => (
                  <tr key={d._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{d.name}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-primary/10 text-primary">{d.specialty}</span></td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{d.hospitalAffiliation}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">${d.consultationFee?.toFixed(0)}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{d.experienceYears} yrs</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/doctors/${d._id}`} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View</Link>
                        <button onClick={() => handleEdit(d)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">Edit</button>
                        <button onClick={() => setDeleteId(d._id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
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

      {editDoctor && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditDoctor(null)}>
          <div className="card-standard w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Edit Doctor</h2>
              <button onClick={() => setEditDoctor(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Specialty</label>
                <select value={editForm.specialty} onChange={(e) => setEditForm((p) => ({ ...p, specialty: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SPECIALTIES.filter(Boolean).map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Consultation Fee</label>
                  <input type="number" value={editForm.consultationFee} onChange={(e) => setEditForm((p) => ({ ...p, consultationFee: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience (years)</label>
                  <input type="number" value={editForm.experienceYears} onChange={(e) => setEditForm((p) => ({ ...p, experienceYears: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hospital Affiliation</label>
                <input type="text" value={editForm.hospitalAffiliation} onChange={(e) => setEditForm((p) => ({ ...p, hospitalAffiliation: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                <textarea value={editForm.bio} onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))} rows={3}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditDoctor(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleSaveEdit} disabled={updateDoctor.isPending}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {updateDoctor.isPending ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="card-standard w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-3" />
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Doctor?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This will permanently remove this doctor profile.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleDelete} disabled={deleteDoctor.isPending}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleteDoctor.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
