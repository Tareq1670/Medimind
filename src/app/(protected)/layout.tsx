"use client";

import { useAuthSession } from "@/hooks/useAuthSession";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/navigation/Sidebar";
import Link from "next/link";
import { authorizeRoute } from "@/lib/route-guard";
import { PROTECTED_ROUTES } from "@/constants";
import { Home, Menu } from "@/lib/icon-map";
import { ErrorBoundary } from "@/components/shared";

const routeRoleMap = PROTECTED_ROUTES.ROLE_MAP;

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPending, isAuthenticated } = useAuthSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const redirectUrl = useMemo(() => {
    if (!user?.role) return null;
    const matchedPrefix = Object.keys(routeRoleMap).find((p) =>
      pathname.startsWith(p)
    );
    if (!matchedPrefix) return null;
    return authorizeRoute(user.role, routeRoleMap[matchedPrefix]);
  }, [user?.role, pathname]);

  useEffect(() => {
    if (!isPending && !isAuthenticated) {
      const redirect = encodeURIComponent(window.location.pathname);
      router.push(`/login?redirect=${redirect}`);
    }
  }, [isPending, isAuthenticated, router]);

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (redirectUrl) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar role={user.role || "user"} onClose={() => setSidebarOpen(false)} />
      </div>
      <div className="hidden lg:block">
        <Sidebar role={user.role || "user"} />
      </div>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </header>
        <main id="main-content" className="flex-1 overflow-y-auto lg:pt-0 pt-14">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
