"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDoctorsList } from "@/hooks/useDoctorsList";
import { useURLFilters } from "@/hooks/useURLFilters";
import { Pagination, StarRating, EmptyState, ActiveFilters } from "@/components/shared";
import { Search, Stethoscope, UserCheck } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { DoctorFilter, Doctor } from "@/types";

const SPECIALTIES = [
  { value: "", label: "All Specialties" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Pediatrics", label: "Pediatrics" },
  { value: "Orthopedics", label: "Orthopedics" },
  { value: "Ophthalmology", label: "Ophthalmology" },
  { value: "Gynecology", label: "Gynecology" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "General Medicine", label: "General Medicine" },
  { value: "ENT", label: "ENT" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  { value: "Pulmonology", label: "Pulmonology" },
  { value: "Endocrinology", label: "Endocrinology" },
];

const RATING_FILTERS = [
  { value: "", label: "Any Rating" },
  { value: "4", label: "4+ Stars" },
  { value: "4.5", label: "4.5+ Stars" },
];

const DOCTORS_PER_PAGE = 12;

const filterSchema = {
  search: { debounce: 300 },
  specialty: {},
  rating: {},
} as const;

function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <Link
      href={`/doctors/${doctor._id}`}
      className="card-standard overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative h-48 bg-gradient-to-br from-accent/5 to-primary/5 flex items-center justify-center">
        {doctor.image ? (
          <Image src={doctor.image} alt={doctor.name} fill className="object-cover" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-3xl font-bold text-primary">{doctor.name?.charAt(0)}</span>
          </div>
        )}
        {doctor.isVerified && (
          <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700 flex items-center gap-1">
            <UserCheck className="w-3 h-3" /> Verified
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white">
          {doctor.name}
        </h3>
        <p className="text-xs text-primary font-medium mt-0.5">{doctor.specialty}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1">
          {doctor.hospitalAffiliation}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={doctor.rating || 0} showValue />
          <span className="text-xs text-slate-400">({doctor.reviewCount || 0})</span>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {doctor.experienceYears} years exp.
          </span>
          <span className="text-sm font-bold text-primary">
            ${doctor.consultationFee?.toFixed(0)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function DoctorCardSkeleton() {
  return (
    <div className="card-standard overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mt-auto" />
      </div>
    </div>
  );
}

export default function DoctorsPage() {
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
  const specialty = f.specialty;
  const rating = f.rating;

  const filter: DoctorFilter = {
    search: search || undefined,
    specialty: specialty || undefined,
    isVerified: true,
    page,
    limit: DOCTORS_PER_PAGE,
  };

  const { data, isLoading, isError } = useDoctorsList(filter);
  const doctors = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Find a Doctor
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Browse our network of verified healthcare professionals
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Filters
        </button>
      </div>

      <div className="flex gap-6">
        <aside className={cn(
          "w-64 shrink-0 space-y-6",
          "max-md:fixed max-md:inset-0 max-md:z-50 max-md:w-full max-md:bg-white dark:max-md:bg-slate-900 max-md:p-6 max-md:overflow-y-auto",
          "transition-transform duration-300",
          showFilters ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        )}>
          {showFilters && (
            <div className="md:hidden flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">X</button>
            </div>
          )}

          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search doctors..."
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                aria-label="Search doctors"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Specialty</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {SPECIALTIES.map((s) => (
                <button key={s.value} onClick={() => set("specialty", s.value || undefined)}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    specialty === s.value ? "bg-primary/10 text-primary font-medium" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Rating</h3>
            <div className="space-y-1">
              {RATING_FILTERS.map((r) => (
                <button key={r.value} onClick={() => set("rating", r.value || undefined)}
                  className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    rating === r.value ? "bg-primary/10 text-primary font-medium" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                  )}
                >
                  {r.label}
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
            onClearAll={resetAll}
            chips={[
              ...(search ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }] : []),
              ...(specialty ? [{ key: "specialty", label: "Specialty", value: specialty, onRemove: () => set("specialty", undefined) }] : []),
              ...(rating ? [{ key: "rating", label: "Rating", value: `${rating}+ stars`, onRemove: () => set("rating", undefined) }] : []),
            ]}
          />

          <div className="flex items-center justify-between mb-6 mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {pagination ? `${pagination.total} doctors found` : ""}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <DoctorCardSkeleton key={i} />)}
            </div>
          ) : isError ? (
            <EmptyState icon={<Stethoscope className="w-12 h-12" />} title="Failed to load doctors" description="Something went wrong. Please try again later." />
          ) : doctors.length === 0 ? (
            <EmptyState
              icon={<Stethoscope className="w-12 h-12" />}
              title="No doctors found"
              description="Try adjusting your filters or search terms."
              action={
                <button onClick={resetAll} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.map((doctor) => <DoctorCard key={doctor._id} doctor={doctor} />)}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    perPage={DOCTORS_PER_PAGE}
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
