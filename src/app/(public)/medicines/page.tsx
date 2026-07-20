"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMedicines } from "@/hooks/useMedicines";
import { useURLFilters } from "@/hooks/useURLFilters";
import { Pagination, StarRating, EmptyState, ActiveFilters } from "@/components/shared";
import { Search, Pill } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { MEDICINE_CATEGORIES, MEDICINE_SORT_OPTIONS, MEDICINES_PER_PAGE } from "@/constants";
import type { Medicine } from "@/types";

const FILTER_CATEGORIES = [
  { value: "", label: "All Categories" },
  ...MEDICINE_CATEGORIES.map((c) => ({ value: c.slug, label: c.name })),
];

const PRICE_RANGES = [
  { label: "All Prices", min: undefined, max: undefined },
  { label: "Under $5", min: 0, max: 5 },
  { label: "$5 - $15", min: 5, max: 15 },
  { label: "$15 - $30", min: 15, max: 30 },
  { label: "Over $30", min: 30, max: undefined },
];

const filters = {
  search: { debounce: 300 },
  category: {},
  priceRange: {},
  prescription: {},
  sort: {},
} as const;

function MedicineCard({ medicine }: { medicine: Medicine }) {
  return (
    <Link
      href={`/medicines/${medicine._id}`}
      className="card-standard overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center overflow-hidden">
        <Image
          src={medicine.image || "https://i.ibb.co/n610Bc4/paracetamol.jpg"}
          alt={medicine.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {medicine.isPrescriptionRequired && (
          <span className="absolute top-3 right-3 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
            Rx
          </span>
        )}
        <span className="absolute top-3 left-3 px-2.5 py-0.5 text-[11px] font-medium rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
          {medicine.category}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-heading text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
          {medicine.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
          {medicine.genericName}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
          {medicine.manufacturer}
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
          {medicine.description || "No description available."}
        </p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-primary">${medicine.price?.toFixed(2)}</span>
          </div>
          <StarRating rating={medicine.rating || 0} showValue />
        </div>
      </div>
    </Link>
  );
}

function MedicineCardSkeleton() {
  return (
    <div className="card-standard overflow-hidden animate-pulse">
      <div className="h-48 bg-slate-200 dark:bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mt-auto" />
      </div>
    </div>
  );
}

export default function MedicinesPage() {
  const { filters: f, page, set, setPage, resetAll, activeFilterCount } = useURLFilters(filters);
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
  const category = f.category;
  const priceRange = Number(f.priceRange) || 0;
  const prescription = f.prescription;
  const sort = f.sort || "createdAt_desc";

  const [sortBy, sortOrder] = sort.split("_") as [string, "asc" | "desc"];

  const filter = {
    search: search || undefined,
    category: category || undefined,
    minPrice: PRICE_RANGES[priceRange]?.min,
    maxPrice: PRICE_RANGES[priceRange]?.max,
    isPrescriptionRequired: prescription === "true" ? true : prescription === "false" ? false : undefined,
    sortBy: sortBy as "name" | "price" | "createdAt" | "stockQuantity",
    sortOrder,
    page,
    limit: MEDICINES_PER_PAGE,
  };

  const { data, isLoading, isError } = useMedicines(filter);
  const medicines = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Medicines
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Browse our comprehensive database of medications
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
        <aside
          className={cn(
            "w-64 shrink-0 space-y-6",
            "max-md:fixed max-md:inset-0 max-md:z-50 max-md:w-full max-md:bg-white dark:max-md:bg-slate-900 max-md:p-6 max-md:overflow-y-auto",
            "transition-transform duration-300",
            showFilters ? "max-md:translate-x-0" : "max-md:-translate-x-full",
          )}
        >
          {showFilters && (
            <div className="md:hidden flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">X</button>
            </div>
          )}

          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Category</h3>
            <div className="space-y-1">
              {FILTER_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => set("category", cat.value || undefined)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    category === cat.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Price Range</h3>
            <div className="space-y-1">
              {PRICE_RANGES.map((range, i) => (
                <button
                  key={i}
                  onClick={() => set("priceRange", i === 0 ? undefined : String(i))}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    priceRange === i
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Prescription</h3>
            <div className="space-y-1">
              {[
                { value: "", label: "All" },
                { value: "false", label: "Over-the-counter" },
                { value: "true", label: "Prescription only" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => set("prescription", opt.value || undefined)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    prescription === opt.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800",
                  )}
                >
                  {opt.label}
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

        {showFilters && (
          <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={() => setShowFilters(false)} />
        )}

        <div className="flex-1 min-w-0">
          <ActiveFilters
            totalCount={activeFilterCount}
            onClearAll={resetAll}
            chips={[
              ...(search ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }] : []),
              ...(category ? [{ key: "category", label: "Category", value: category, onRemove: () => set("category", undefined) }] : []),
              ...(prescription ? [{ key: "prescription", label: "Prescription", value: prescription === "true" ? "Rx only" : "OTC", onRemove: () => set("prescription", undefined) }] : []),
              ...(priceRange > 0 ? [{ key: "priceRange", label: "Price", value: PRICE_RANGES[priceRange]?.label || "", onRemove: () => set("priceRange", undefined) }] : []),
            ]}
          />

          <div className="flex items-center justify-between mb-6 mt-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {pagination ? `${pagination.total} medicines found` : ""}
            </p>
            <select
              value={sort}
              onChange={(e) => set("sort", e.target.value === "createdAt_desc" ? undefined : e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {MEDICINE_SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <MedicineCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              icon={<Pill className="w-12 h-12" />}
              title="Failed to load medicines"
              description="Something went wrong. Please try again later."
            />
          ) : medicines.length === 0 ? (
            <EmptyState
              icon={<Pill className="w-12 h-12" />}
              title="No medicines found"
              description="Try adjusting your filters or search terms."
              action={
                <button onClick={resetAll} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  Clear Filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {medicines.map((medicine) => (
                  <MedicineCard key={medicine._id} medicine={medicine} />
                ))}
              </div>
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    perPage={MEDICINES_PER_PAGE}
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
