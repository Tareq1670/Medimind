"use client";

import { useState, useEffect } from "react";
import { usePatients } from "@/hooks/usePatients";
import { Search } from "@/lib/icon-map";
import { CardSkeleton, EmptyState, ActiveFilters } from "@/components/shared";
import { useURLFilters } from "@/hooks/useURLFilters";

const patientFilters = {
  search: { debounce: 300 },
} as const;

export default function PatientsPage() {
  const { data: patients, isLoading } = usePatients();
  const { filters: f, set, resetAll, activeFilterCount } = useURLFilters(patientFilters);
  const [searchInput, setSearchInput] = useState(f.search);

  useEffect(() => { setSearchInput(f.search); }, [f.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== f.search) set("search", searchInput || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, f.search, set]);

  const search = f.search;

  const filtered = (patients || []).filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Patients</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {patients?.length || 0} patients linked
        </p>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search patients..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
      </div>

      <ActiveFilters
        totalCount={activeFilterCount}
        onClearAll={() => { resetAll(); setSearchInput(""); }}
        chips={
          search
            ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }]
            : []
        }
      />

      {isLoading ? (
        <CardSkeleton count={6} />
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
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
        <EmptyState
          title={search ? "No patients match your search" : "No patients linked yet"}
          description={search ? "Try adjusting your search term." : "Patients will appear here once they connect with you."}
        />
      )}
    </div>
  );
}
