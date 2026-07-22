"use client";

import { useState, useEffect } from "react";
import { useReviews, useModerateReview, useDeleteReview } from "@/hooks/useReviews";
import { Search } from "@/lib/icon-map";
import { ListSkeleton, Pagination, ActiveFilters, EmptyState } from "@/components/shared";
import { useURLFilters } from "@/hooks/useURLFilters";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const reviewFilters = {
  search: { debounce: 300 },
  status: {},
} as const;

export default function ReviewsPage() {
  const { filters: f, page, set, setMany, setPage, resetAll, activeFilterCount } = useURLFilters(reviewFilters);
  const [searchInput, setSearchInput] = useState(f.search);

  useEffect(() => { setSearchInput(f.search); }, [f.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== f.search) set("search", searchInput || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, f.search, set]);

  const search = f.search;
  const statusFilter = (f.status || "pending") as StatusFilter;

  const approvedParam = statusFilter === "approved" ? "true" : statusFilter === "rejected" ? "false" : undefined;

  const filter = {
    search: search || undefined,
    approved: approvedParam,
    page,
    limit: 10,
  };
  const { data, isLoading } = useReviews(filter);
  const reviews = data?.data || [];
  const pagination = data?.pagination;
  const moderate = useModerateReview();
  const del = useDeleteReview();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review Moderation</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {pagination?.total || 0} reviews total
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search reviews"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {(["pending", "approved", "rejected", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setMany({ status: s })}
              className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? "bg-primary text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <ActiveFilters
        totalCount={activeFilterCount}
        onClearAll={() => { resetAll(); setSearchInput(""); }}
        chips={[
          ...(search ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }] : []),
          ...(statusFilter !== "pending" ? [{ key: "status", label: "Status", value: statusFilter, onRemove: () => set("status", "pending") }] : []),
        ]}
      />

      {isLoading ? (
        <ListSkeleton count={3} />
      ) : reviews.length > 0 ? (
        <>
          <div className="space-y-3">
            {reviews.map((r) => (
                <div key={r._id} className="card-standard p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {r.reviewer?.name || "Anonymous"}
                        </p>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              className={`w-3.5 h-3.5 ${i < r.rating ? "text-yellow-400" : "text-slate-200 dark:text-slate-600"}`}
                              fill="currentColor" viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-slate-400 capitalize">{r.targetType}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{r.comment}</p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(r.createdAt).toLocaleDateString()}
                        <span className={`ml-2 inline-block px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${
                          r.isApproved
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        }`}>
                          {r.isApproved ? "approved" : "pending"}
                        </span>
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                      {!r.isApproved && (
                        <>
                          <button
                            onClick={() => moderate.mutate({ id: r._id, status: "approved" })}
                            disabled={moderate.isPending}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => moderate.mutate({ id: r._id, status: "rejected" })}
                            disabled={moderate.isPending}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => del.mutate(r._id)}
                        disabled={del.isPending}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400">Page {page} of {pagination.totalPages}</p>
              <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title={`No ${statusFilter !== "all" ? statusFilter : ""} reviews found`}
          description="Reviews that match your search will appear here."
        />
      )}
    </div>
  );
}
