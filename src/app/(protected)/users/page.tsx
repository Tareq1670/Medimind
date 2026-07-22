"use client";

import { useState, useEffect } from "react";
import { useUsers, useUpdateUser } from "@/hooks/useUsers";
import { Search, Users as UsersIcon } from "@/lib/icon-map";
import { TableSkeleton, Pagination, ActiveFilters, EmptyState } from "@/components/shared";
import { useURLFilters } from "@/hooks/useURLFilters";

type RoleFilter = "all" | "user" | "doctor" | "admin";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  doctor: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  user: "bg-slate-100 dark:bg-slate-800 text-slate-500",
};

const userFilters = {
  search: { debounce: 300 },
  role: {},
} as const;

export default function UsersPage() {
  const { filters: f, page, set, setMany, setPage, resetAll, activeFilterCount } = useURLFilters(userFilters);
  const [searchInput, setSearchInput] = useState(f.search);
  const updateUser = useUpdateUser();

  useEffect(() => { setSearchInput(f.search); }, [f.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== f.search) set("search", searchInput || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, f.search, set]);

  const search = f.search;
  const roleFilter = (f.role || "all") as RoleFilter;

  const filter = {
    search: search || undefined,
    role: roleFilter !== "all" ? roleFilter : undefined,
    page,
    limit: 15,
  };
  const { data, isLoading } = useUsers(filter);
  const users = data?.data || [];
  const pagination = data?.pagination;

  const handleBan = async (id: string, banned: boolean) => {
    await updateUser.mutateAsync({ id, data: { banned: !banned } as { banned: boolean } });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {pagination?.total || 0} users on the platform
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search users"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>
        {(["all", "user", "doctor", "admin"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setMany({ role: r === "all" ? undefined : r })}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              roleFilter === r
                ? "bg-primary text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
      </div>

      <ActiveFilters
        totalCount={activeFilterCount}
        onClearAll={() => { resetAll(); setSearchInput(""); }}
        chips={[
          ...(search ? [{ key: "search", label: "Search", value: search, onRemove: () => { set("search", undefined); setSearchInput(""); } }] : []),
          ...(roleFilter !== "all" ? [{ key: "role", label: "Role", value: roleFilter, onRemove: () => set("role", undefined) }] : []),
        ]}
      />

      {isLoading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : users.length > 0 ? (
        <div className="card-standard overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                          {u.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{u.email}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${ROLE_COLORS[u.role] || ROLE_COLORS.user}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium ${u.banned ? "text-red-500" : "text-green-500"}`}>
                        {u.banned ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleBan(u._id, u.banned)}
                        disabled={updateUser.isPending}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                          u.banned
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100"
                            : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100"
                        }`}
                      >
                        {u.banned ? "Unban" : "Ban"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400">Page {page} of {pagination.totalPages}</p>
              <Pagination page={page} totalPages={pagination.totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<UsersIcon className="w-12 h-12" />}
          title="No users found"
          description={search ? "Try a different search term." : "There are no users on the platform yet."}
        />
      )}
    </div>
  );
}
