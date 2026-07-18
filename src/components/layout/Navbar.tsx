"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, Stethoscope } from "lucide-react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/medicines", label: "Medicines" },
  { href: "/doctors", label: "Doctors" },
  { href: "/ai-symptom-checker", label: "AI Symptom Checker" },
];

export function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b",
        "bg-bg-card/80",
        "backdrop-blur-md border-border-subtle",
        "transition-layout"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MediMind
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-neutral hover:text-primary transition-layout"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            isIconOnly
            variant="ghost"
            aria-label="Toggle theme"
            onPress={() => setTheme(isDark ? "light" : "dark")}
            className="text-neutral rounded-button"
          >
            {mounted ? (isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />) : <div className="h-5 w-5" />}
          </Button>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" onPress={() => router.push("/login")}>
              Login
            </Button>
            <Button variant="primary" onPress={() => router.push("/register")}>
              Register
            </Button>
          </div>

          <Button
            isIconOnly
            variant="ghost"
            aria-label="Toggle menu"
            className="text-neutral rounded-button md:hidden"
            onPress={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border-subtle md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-button px-3 py-2 text-sm font-medium text-neutral hover:bg-slate-100 dark:hover:bg-slate-800 transition-layout"
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-border-subtle" />
            <Button
              variant="ghost"
              fullWidth
              onPress={() => {
                router.push("/login");
                setMobileOpen(false);
              }}
            >
              Login
            </Button>
            <Button
              variant="primary"
              fullWidth
              onPress={() => {
                router.push("/register");
                setMobileOpen(false);
              }}
            >
              Register
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
