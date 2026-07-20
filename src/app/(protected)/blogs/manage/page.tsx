"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBlogsManage, useUpdateBlog, useDeleteBlog } from "@/hooks/useBlogsList";
import { TableSkeleton, EmptyState, Pagination, ActiveFilters } from "@/components/shared";
import { BookOpen, Search, X, Loader2, AlertTriangle, Plus } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import { useURLFilters } from "@/hooks/useURLFilters";
import type { Blog } from "@/types";

const blogFilters = {
  search: { debounce: 300 },
  status: {},
} as const;

export default function ManageBlogsPage() {
  const { filters: f, page, set, setMany, setPage, resetAll, activeFilterCount } = useURLFilters(blogFilters);
  const [searchInput, setSearchInput] = useState(f.search);

  useEffect(() => { setSearchInput(f.search); }, [f.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== f.search) set("search", searchInput || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, f.search, set]);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", status: "Draft" as "Draft" | "Published" });

  const search = f.search;
  const statusFilter = f.status;

  const filter = {
    search: search || undefined,
    status: (statusFilter || undefined) as "Draft" | "Published" | undefined,
    page,
    limit: 20,
  };
  const { data, isLoading } = useBlogsManage(filter);
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();
  const blogs = data?.data || [];

  const handleEdit = (b: Blog) => {
    setEditBlog(b);
    setEditForm({ title: b.title, content: b.content || "", status: b.status as "Draft" | "Published" });
  };

  const handleSaveEdit = async () => {
    if (!editBlog) return;
    try {
      await updateBlog.mutateAsync({
        id: editBlog._id,
        data: { title: editForm.title, content: editForm.content, status: editForm.status },
      });
      setEditBlog(null);
    } catch { /* handled */ }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await deleteBlog.mutateAsync(deleteId); setDeleteId(null); } catch { /* handled */ }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Manage Blogs</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{data?.pagination?.total || 0} articles</p>
        </div>
        <Link href="/blogs/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Write Article
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" placeholder="Search articles..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["", "Published", "Draft"].map((s) => (
            <button key={s} onClick={() => setMany({ status: s || undefined })}
              className={cn("px-3 py-2 rounded-xl text-sm font-medium transition-colors border",
                statusFilter === s ? "bg-primary text-white border-primary" : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800",
              )}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      <ActiveFilters
        totalCount={activeFilterCount}
        onClearAll={() => { resetAll(); setSearchInput(""); }}
        chips={[
          ...(search ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }] : []),
          ...(statusFilter ? [{ key: "status", label: "Status", value: statusFilter, onRemove: () => set("status", undefined) }] : []),
        ]}
      />

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : blogs.length === 0 ? (
        <EmptyState icon={<BookOpen className="w-12 h-12" />} title="No articles found"
          action={!search ? <Link href="/blogs/create" className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium">Write Article</Link> : undefined}
        />
      ) : (
        <div className="card-standard overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden md:table-cell">Views</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 hidden lg:table-cell">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr key={b._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{b.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-1">{b.excerpt?.slice(0, 60)}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={cn("px-2 py-0.5 text-[11px] font-medium rounded-full",
                        b.status === "Published" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
                      )}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell">{b.viewCount}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 hidden lg:table-cell">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blogs/${b._id}`} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">View</Link>
                        <button onClick={() => handleEdit(b)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">Edit</button>
                        <button onClick={() => setDeleteId(b._id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
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
              <Pagination page={page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {editBlog && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditBlog(null)}>
          <div className="card-standard w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">Edit Article</h2>
              <button onClick={() => setEditBlog(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input type="text" value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as "Draft" | "Published" }))}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea value={editForm.content} onChange={(e) => setEditForm((p) => ({ ...p, content: e.target.value }))} rows={8}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditBlog(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleSaveEdit} disabled={updateBlog.isPending}
                className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {updateBlog.isPending ? <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="card-standard w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-3" />
            <h2 className="font-heading text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Article?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This will permanently remove this article.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300">Cancel</button>
              <button onClick={handleDelete} disabled={deleteBlog.isPending}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {deleteBlog.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
