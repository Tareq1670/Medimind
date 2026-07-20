"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Stethoscope,
  Sun,
  Moon,
  Menu,
  X,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  HeartPulse,
  FileText,
  Pill,
  ChevronDown,
  BrainCircuit,
  BookOpen,
  MoreHorizontal,
  Search,
  ScanSearch,
  Users,
  CalendarDays,
  BarChart3,
  Star,
  UserCircle,
  Shield,
} from "@/lib/icon-map";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton, Avatar, AvatarFallback, Dropdown, DropdownTrigger, DropdownPopover } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useAuthSession } from "@/hooks/useAuthSession";
import { authClient } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: string[];
}

interface NavCategory {
  label: string;
  icon: typeof LayoutDashboard;
  href?: string;
  items?: NavItem[];
  roles: string[];
}

const publicCategories: NavCategory[] = [
  {
    label: "Medicines",
    icon: Pill,
    href: "/medicines",
    roles: ["user", "doctor", "admin"],
  },
  {
    label: "Doctors",
    icon: Stethoscope,
    href: "/doctors",
    roles: ["user", "doctor", "admin"],
  },
  {
    label: "Conditions",
    icon: HeartPulse,
    href: "/conditions",
    roles: ["user", "doctor", "admin"],
  },
  {
    label: "Health Articles",
    icon: BookOpen,
    href: "/blogs",
    roles: ["user", "doctor", "admin"],
  },
  {
    label: "About",
    icon: FileText,
    href: "/about",
    roles: ["user", "doctor", "admin"],
  },
];

const userMenuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

const roleLinks: Record<string, { href: string; label: string; icon: React.ComponentType<{ className?: string }> }[]> = {
  user: [
    { href: "/ai-assistant", label: "AI Assistant", icon: BrainCircuit },
    { href: "/report-analysis", label: "Report Analysis", icon: ScanSearch },
    { href: "/health-records", label: "Health Records", icon: HeartPulse },
    { href: "/symptom-checker", label: "Symptom Checker", icon: Search },
  ],
  doctor: [
    { href: "/ai-assistant", label: "AI Assistant", icon: BrainCircuit },
    { href: "/report-analysis", label: "Report Analysis", icon: ScanSearch },
    { href: "/patients", label: "My Patients", icon: Users },
    { href: "/schedule", label: "Schedule", icon: CalendarDays },
  ],
  admin: [
    { href: "/ai-assistant", label: "AI Assistant", icon: BrainCircuit },
    { href: "/report-analysis", label: "Report Analysis", icon: ScanSearch },
    { href: "/users", label: "Users", icon: Users },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/reviews", label: "Reviews", icon: Star },
  ],
};

const notifications = [
  {
    id: 1,
    title: "AI Analysis Complete",
    description: "Your symptom analysis results are ready to review",
    time: "2 min ago",
    icon: BrainCircuit,
  },
  {
    id: 2,
    title: "Medicine Refill Reminder",
    description: "Your prescription for Amoxicillin needs a refill",
    time: "1 hour ago",
    icon: FileText,
  },
  {
    id: 3,
    title: "Health Record Updated",
    description: "New lab report has been added to your records",
    time: "3 hours ago",
    icon: FileText,
  },
];

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, invalidateSession } = useAuthSession();
  const { setTheme, resolvedTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const notifRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const userMenuOpenRef = useRef(userMenuOpen);
  userMenuOpenRef.current = userMenuOpen;

  const isDark = resolvedTheme === "dark";
  const role = (user?.role as "user" | "doctor" | "admin") ?? "user";

  const visibleCategories = publicCategories;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      if (userMenuOpenRef.current) {
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const closeAllDropdowns = () => {
      setNotifOpen(false);
      setUserMenuOpen(false);
      setOpenCategory(null);
    };

    const closeIfOutside = (e: Event) => {
      const target = e.target as Node;
      const isOutsideUserMenu = !userMenuRef.current?.contains(target);
      const isOutsideNav = !navRef.current?.contains(target);
      const isOutsideNotif = !notifRef.current?.contains(target);

      if (isOutsideUserMenu && userMenuOpenRef.current) {
        setUserMenuOpen(false);
      }

      if (isOutsideNav && isOutsideNotif && isOutsideUserMenu) {
        setNotifOpen(false);
        setOpenCategory(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllDropdowns();
      }
    };

    const handleResize = () => {
      closeAllDropdowns();
    };

    document.addEventListener("mousedown", closeIfOutside);
    document.addEventListener("touchstart", closeIfOutside);
    document.addEventListener("wheel", closeIfOutside, { passive: true });
    document.addEventListener("touchmove", closeIfOutside, { passive: true });
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", closeIfOutside);
      document.removeEventListener("touchstart", closeIfOutside);
      document.removeEventListener("wheel", closeIfOutside);
      document.removeEventListener("touchmove", closeIfOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
    setNotifOpen(false);
    setOpenCategory(null);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const onBackgroundScroll = (e: Event) => {
      if (mobilePanelRef.current && !mobilePanelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    window.addEventListener("wheel", onBackgroundScroll, { passive: true });
    window.addEventListener("touchmove", onBackgroundScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", onBackgroundScroll);
      window.removeEventListener("touchmove", onBackgroundScroll);
    };
  }, [isOpen]);

  const handleSignOut = useCallback(async () => {
    setSigningOut(true);
    try {
      clearTokenCache();
      await authClient.signOut();
      queryClient.clear();
      await invalidateSession();
      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Failed to sign out.");
    } finally {
      setSigningOut(false);
      setUserMenuOpen(false);
    }
  }, [queryClient, invalidateSession, router]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  const isCategoryActive = (cat: NavCategory): boolean => {
    if (cat.href) return isActive(cat.href);
    return cat.items?.some((item) => isActive(item.href)) ?? false;
  };

  const userInitial = user?.name?.charAt(0)?.toUpperCase() ?? null;

  const roleBadgeStyles: Record<string, string> = {
    user: "bg-primary/10 text-primary",
    doctor: "bg-[var(--color-secondary)]/10 dark:bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]",
    admin: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  };

  const roleBadgeIcons: Record<string, typeof UserCircle> = {
    user: UserCircle,
    doctor: Stethoscope,
    admin: Shield,
  };

  const RoleBadgeIcon = roleBadgeIcons[role] ?? UserCircle;

  return (
    <>
      <header
        className={cn(
        "fixed top-0  z-50 w-full transition-all duration-500",
        scrolled
          ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-lg shadow-slate-900/5 dark:shadow-black/20"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="flex items-center justify-between w-full h-20 px-4 sm:px-6 mx-auto max-w-7xl">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">
            MediMind
          </span>
        </Link>

        {/* Desktop Nav — grouped category dropdowns */}
        <nav
          ref={navRef}
          className="hidden xl:flex items-center gap-x-1"
        >
          {visibleCategories.map((cat) =>
            cat.href ? (
              <Link
                key={cat.label}
                href={cat.href}
                className={cn(
                  "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                  isActive(cat.href)
                    ? "text-primary bg-primary/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/50",
                )}
              >
                <cat.icon className="h-4 w-4 shrink-0" />
                {cat.label}
                {isActive(cat.href) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 w-3/5 rounded-full bg-primary" />
                )}
              </Link>
            ) : (
              <div key={cat.label} className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenCategory(openCategory === cat.label ? null : cat.label)
                  }
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                    isCategoryActive(cat)
                      ? "text-primary bg-primary/10"
                      : "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/50",
                    openCategory === cat.label && "bg-slate-100 dark:bg-slate-800",
                  )}
                  aria-expanded={openCategory === cat.label}
                  aria-haspopup="true"
                >
                  <cat.icon className="h-4 w-4 shrink-0" />
                  {cat.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      openCategory === cat.label && "rotate-180",
                    )}
                  />
                </button>

                <AnimatePresence>
                  {openCategory === cat.label && cat.items && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute left-0 top-full mt-1 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/30 backdrop-blur-xl overflow-hidden origin-top-left"
                    >
                      <div className="py-1.5">
                        <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {cat.label}
                        </p>
                        {cat.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenCategory(null)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                              isActive(item.href)
                                ? "text-primary bg-primary/5 dark:bg-primary/10 font-medium"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ),
          )}
          {isAuthenticated && (
            <>
              <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-0.5" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setOpenCategory(openCategory === "More" ? null : "More")
                  }
                  className={cn(
                    "relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                    openCategory === "More" && "bg-slate-100 dark:bg-slate-800",
                    "text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800/50",
                  )}
                  aria-expanded={openCategory === "More"}
                  aria-haspopup="true"
                >
                  <MoreHorizontal className="h-4 w-4 shrink-0" />
                  More
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      openCategory === "More" && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence>
                  {openCategory === "More" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-1 w-56 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/30 backdrop-blur-xl overflow-hidden origin-top-right"
                    >
                      <div className="py-1.5">
                        <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          Quick Access
                        </p>
                        {roleLinks[role]?.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpenCategory(null)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                              isActive(item.href)
                                ? "text-primary bg-primary/5 dark:bg-primary/10 font-medium"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
                            )}
                          >
                            <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </nav>

        <div className="flex items-center gap-x-4">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
            aria-label="Toggle theme"
          >
            <div
              className={cn(
                "transition-all duration-500",
                mounted && isDark ? "rotate-180" : "rotate-0"
              )}
            >
              {mounted ? (
                isDark ? (
                  <Sun className="h-[18px] w-[18px]" />
                ) : (
                  <Moon className="h-[18px] w-[18px]" />
                )
              ) : (
                <div className="h-[18px] w-[18px]" />
              )}
            </div>
          </button>

          {/* Notification Bell — auth-gated */}
          {isAuthenticated && (
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {notifications.length}
                </span>
              </button>

              {/* Notification Dropdown */}
              <div
                className={cn(
                  "absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[22rem] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/30 backdrop-blur-xl overflow-hidden origin-top-right transition-all duration-200",
                  notifOpen
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible pointer-events-none"
                )}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</p>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">{notifications.length} new</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className="flex w-full gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-150"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
                        <n.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.description}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2.5">
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Auth Section */}
          <div className="hidden xl:flex items-center gap-1">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center gap-2 rounded-xl px-2 py-1.5"
                >
                  <Skeleton className="flex rounded-full w-7 h-7 bg-slate-200/60 dark:bg-slate-800/60" />
                  <Skeleton className="hidden lg:block h-4 w-20 rounded-lg bg-slate-200/60 dark:bg-slate-800/60" />
                </motion.div>
              ) : isAuthenticated && user ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div ref={userMenuRef}>
                    <Dropdown
                      isOpen={userMenuOpen}
                      onOpenChange={setUserMenuOpen}
                    >
                      <DropdownTrigger
                      className={cn(
                        "rounded-xl px-2 py-1.5 transition-all duration-200",
                        userMenuOpen
                          ? "bg-slate-100 dark:bg-slate-800"
                          : "hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          size="md"
                          className="cursor-pointer transition-transform duration-200 hover:scale-105 border-2 border-teal-500"
                        >
                          <Avatar.Image
                            src={user?.image || undefined}
                            crossOrigin="anonymous"
                            className="transition-transform duration-200"
                          />
                          <AvatarFallback className="bg-gradient-to-tr from-blue-500 to-teal-500 text-white font-bold text-xs">
                            {user?.name ? (
                              <span className="text-sm font-bold uppercase">{user.name.charAt(0)}</span>
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden lg:inline max-w-[100px] truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                          {user.name}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 text-slate-400 transition-transform duration-200",
                            userMenuOpen && "rotate-180"
                          )}
                        />
                      </div>
                    </DropdownTrigger>
                    <DropdownPopover
                      className="min-w-[14rem] rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-900/10 dark:shadow-black/30 backdrop-blur-xl origin-top-right"
                    >
                      <div className="py-1">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {user.name ?? "User"}
                          </p>
                          {user.email && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {user.email}
                            </p>
                          )}
                          {user.role && (
                            <span className={cn(
                              "inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full",
                              roleBadgeStyles[role] ?? "bg-primary/10 text-primary"
                            )}>
                              <RoleBadgeIcon className="h-3 w-3" />
                              {user.role}
                            </span>
                          )}
                        </div>
                        <div className="py-1">
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-150"
                            >
                              <item.icon className="h-4 w-4 text-slate-400" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 dark:border-slate-800 py-1">
                          <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={signingOut}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                          >
                            <LogOut className="h-4 w-4" />
                            {signingOut ? "Signing out..." : "Sign Out"}
                          </button>
                        </div>
                      </div>
                    </DropdownPopover>
                    </Dropdown>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auth-buttons"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex items-center gap-1"
                >
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    className="rounded-xl px-3.5 h-9 flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href={`/register?redirect=${encodeURIComponent(pathname)}`}
                    className="rounded-xl px-3.5 h-9 flex items-center text-sm font-medium bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/20 transition-all duration-200"
                  >
                    Register
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => {
              setIsOpen((prev) => !prev);
              setNotifOpen(false);
              setUserMenuOpen(false);
              setOpenCategory(null);
            }}
            className="flex xl:hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-backdrop"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile slide-out drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-drawer"
            ref={mobilePanelRef}
            className="fixed right-0 top-0 z-50 w-full max-w-xs h-screen xl:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          >
            {/* Brand identity zone */}
            <div className="flex justify-between items-center w-full mb-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold tracking-tight shrink-0"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">
                  MediMind
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-0.5">
              {/* Show category groups with headers on mobile */}
              {visibleCategories.map((cat) =>
                cat.href ? (
                  <Link
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive(cat.href)
                        ? "text-primary bg-primary/10"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50",
                    )}
                  >
                    <cat.icon className="h-4 w-4 shrink-0 text-slate-400" />
                    {cat.label}
                  </Link>
                ) : (
                  <div key={cat.label} className="flex flex-col gap-0.5">
                    <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      <cat.icon className="inline h-3 w-3 mr-1 -mt-0.5" />
                      {cat.label}
                    </p>
                    {cat.items?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ml-2",
                          isActive(item.href)
                            ? "text-primary bg-primary/10"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ),
              )}

              {isAuthenticated && (
                <>
                  <div className="pt-2 pb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    <MoreHorizontal className="inline h-3 w-3 mr-1 -mt-0.5" />
                    Quick Access
                  </div>
                  <div className="ml-2 border-l-2 border-slate-200 dark:border-slate-700 pl-3 space-y-0.5">
                    {roleLinks[role]?.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200",
                          isActive(item.href)
                            ? "text-primary bg-primary/10"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50",
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <hr className="my-2 border-slate-200 dark:border-slate-800" />

              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white text-sm font-semibold shrink-0">
                      {userInitial ?? <User className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {user.name ?? "User"}
                      </p>
                      {user.email && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      )}
                      {user.role && (
                        <span className={cn(
                          "inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full",
                          roleBadgeStyles[role] ?? "bg-primary/10 text-primary"
                        )}>
                          <RoleBadgeIcon className="h-2.5 w-2.5" />
                          {user.role}
                        </span>
                      )}
                    </div>
                  </div>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-150"
                    >
                      <item.icon className="h-4 w-4 shrink-0 text-slate-400" />
                      {item.label}
                    </Link>
                  ))}
                  <hr className="my-2 border-slate-200 dark:border-slate-800" />
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    disabled={signingOut}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                  >
                    <LogOut className="h-4 w-4" />
                    {signingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={`/login?redirect=${encodeURIComponent(pathname)}`}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors duration-150"
                  >
                    Login
                  </Link>
                  <Link
                    href={`/register?redirect=${encodeURIComponent(pathname)}`}
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-center bg-primary text-white hover:bg-primary/90 transition-colors duration-150"
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
