"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useConditions } from "@/hooks/useConditions";
import { useURLFilters } from "@/hooks/useURLFilters";
import { Pagination, EmptyState, ActiveFilters } from "@/components/shared";
import { Search, AlertTriangle } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { Condition } from "@/types";

const SEVERITY_OPTIONS = [
  { value: "", label: "All Severities", color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300" },
  { value: "Low", label: "Low", color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300" },
  { value: "High", label: "High", color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300" },
];

const CONDITIONS_PER_PAGE = 12;

const filterSchema = {
  search: { debounce: 300 },
  severity: {},
} as const;

function ConditionCard({ condition }: { condition: Condition }) {
  const severityColors: Record<string, string> = {
    Low: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
    Medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
    High: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
  };

  return (
    <Link href={`/conditions/${condition._id}`}
      className="card-standard overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative h-40 bg-gradient-to-br from-accent/5 to-primary/5 flex items-center justify-center">
        <AlertTriangle className="w-16 h-16 text-primary/30 group-hover:text-primary/50 transition-colors" />
        <span className={cn("absolute top-3 right-3 px-2.5 py-0.5 text-[11px] font-semibold rounded-full border",
          severityColors[condition.severity] || severityColors.Low,
        )}>
          {condition.severity}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white">{condition.title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">{condition.description}</p>
        {condition.symptoms && condition.symptoms.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {condition.symptoms.slice(0, 3).map((symptom, i) => (
              <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{symptom}</span>
            ))}
            {condition.symptoms.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">+{condition.symptoms.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

function ConditionCardSkeleton() {
  return (
    <div className="card-standard overflow-hidden animate-pulse">
      <div className="h-40 bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        <div className="flex gap-2"><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-16" /><div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20" /></div>
      </div>
    </div>
  );
}

export default function ConditionsPage() {
  const { filters: f, page, set, setPage, resetAll, activeFilterCount } = useURLFilters(filterSchema);
  const [searchInput, setSearchInput] = useState(f.search);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { setSearchInput(f.search); }, [f.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== f.search) set("search", searchInput || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, f.search, set]);

  const search = f.search;
  const severity = f.severity;

  const filter = {
    search: search || undefined,
    severity: severity || undefined,
    page,
    limit: CONDITIONS_PER_PAGE,
  };

  const { data, isLoading, isError } = useConditions(filter);
  const conditions = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Health Conditions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Comprehensive information about medical conditions, symptoms, and treatments</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={cn("w-64 shrink-0 space-y-6", "max-md:fixed max-md:inset-0 max-md:z-50 max-md:w-full max-md:bg-white dark:max-md:bg-slate-900 max-md:p-6 max-md:overflow-y-auto", "transition-transform duration-300", showFilters ? "max-md:translate-x-0" : "max-md:-translate-x-full")}>
          {showFilters && (
            <div className="md:hidden flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">X</button>
            </div>
          )}
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search conditions..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search conditions"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Severity</h3>
            <div className="space-y-1">
              {SEVERITY_OPTIONS.map((s) => (
                <button key={s.value} onClick={() => set("severity", s.value || undefined)}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors", severity === s.value ? "bg-primary/10 text-primary font-medium" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800")}
                >
                  <span className={cn("inline-block px-2 py-0.5 rounded text-xs font-medium", s.color)}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={resetAll}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Clear Filters
          </button>
        </aside>

        {showFilters && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setShowFilters(false)} />}

        <div className="flex-1 min-w-0">
          <ActiveFilters
            totalCount={activeFilterCount}
            onClearAll={() => { resetAll(); setSearchInput(""); }}
            chips={[
              ...(search ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }] : []),
              ...(severity ? [{ key: "severity", label: "Severity", value: severity, onRemove: () => set("severity", undefined) }] : []),
            ]}
          />

          <div className="flex items-center justify-between mb-6 mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">{pagination ? `${pagination.total} conditions found` : ""}</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <ConditionCardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <EmptyState icon={<AlertTriangle className="w-12 h-12" />} title="Failed to load conditions" description="Something went wrong. Please try again later." />
          ) : conditions.length === 0 ? (
            <EmptyState icon={<AlertTriangle className="w-12 h-12" />} title="No conditions found" description="Try adjusting your search or severity filter."
              action={<button onClick={() => { resetAll(); setSearchInput(""); }} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">Clear Filters</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {conditions.map((condition) => <ConditionCard key={condition._id} condition={condition} />)}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    perPage={CONDITIONS_PER_PAGE}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
