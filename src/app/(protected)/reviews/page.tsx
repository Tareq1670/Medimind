"use client";

import { useReviews, useModerateReview, useDeleteReview } from "@/hooks/useReviews";
import { useState } from "react";

export default function ReviewsPage() {
  const [statusFilter, setStatusFilter] = useState("pending");
  const { data: reviews, isLoading } = useReviews(statusFilter);
  const moderate = useModerateReview();
  const del = useDeleteReview();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Review Moderation</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Approve, reject, or manage user reviews</p>
      </div>

      <div className="flex gap-2">
        {["pending", "approved", "rejected", "all"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
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

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-standard p-5 animate-pulse">
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded mt-3" />
            </div>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r._id} className="card-standard p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{r.userName}</p>
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
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{r.comment}</p>
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(r.createdAt).toLocaleDateString()}
                    <span className={`ml-2 inline-block px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${
                      r.status === "approved"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                        : r.status === "rejected"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    }`}>
                      {r.status}
                    </span>
                  </p>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => moderate.mutate({ id: r._id, status: "approved" })}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => moderate.mutate({ id: r._id, status: "rejected" })}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {r.status !== "pending" && (
                  <button
                    onClick={() => del.mutate(r._id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-red-50 hover:text-red-500"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-standard p-10 text-center">
          <p className="text-slate-500 dark:text-slate-400">No {statusFilter !== "all" ? statusFilter : ""} reviews found.</p>
        </div>
      )}
    </div>
  );
}
