"use client";

import { usePatients } from "@/hooks/usePatients";

export default function PatientsPage() {
  const { data: patients, isLoading } = usePatients();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Patients</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">View and manage your linked patients</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-standard p-5 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : patients && patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.map((p) => (
            <div key={p._id} className="card-standard p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shrink-0">
                {p.name?.charAt(0)?.toUpperCase() || "P"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{p.name}</p>
                <p className="text-xs text-slate-500 truncate">{p.email}</p>
                {p.bloodGroup && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                    {p.bloodGroup}
                  </span>
                )}
              </div>
              {p.lastVisit && (
                <span className="text-[10px] text-slate-400 shrink-0">
                  Last: {new Date(p.lastVisit).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-standard p-10 text-center">
          <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-slate-500 dark:text-slate-400">No patients linked to your account yet.</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Patients will appear here once they connect with you.</p>
        </div>
      )}
    </div>
  );
}
