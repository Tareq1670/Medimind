import Link from "next/link";
import { Stethoscope, TriangleAlert } from "lucide-react";

const platformLinks = [
  { href: "/medicines", label: "Medicine Database" },
  { href: "/doctors", label: "Find a Doctor" },
  { href: "/ai-symptom-checker", label: "AI Symptom Checker" },
  { href: "/pharmacies", label: "Nearby Pharmacies" },
];

const complianceLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/hipaa", label: "HIPAA Compliance" },
  { href: "/gdpr", label: "GDPR Notice" },
];

const companyLinks = [
  { href: "/about", label: "About Us" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Blog" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-bg-card transition-layout">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <Stethoscope className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MediMind
              </span>
            </Link>
            <p className="mt-3 text-sm text-neutral leading-relaxed">
              Intelligent healthcare navigation platform. Bridging patients with
              trusted medical resources through AI-driven insights.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral">
              Platform
            </h3>
            <ul className="mt-4 space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral hover:text-primary transition-layout"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral">
              Compliance
            </h3>
            <ul className="mt-4 space-y-3">
              {complianceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral hover:text-primary transition-layout"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral hover:text-primary transition-layout"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-card border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 transition-layout">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                Medical Disclaimer
              </p>
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                MediMind provides informational content only and does not
                constitute medical advice. Always consult a qualified healthcare
                professional for medical decisions. Do not use this platform for
                emergencies. If you are experiencing a medical emergency, call
                911 immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border-subtle pt-6 sm:flex-row">
          <p className="text-xs text-neutral">
            &copy; {currentYear} MediMind. All rights reserved.
          </p>
          <p className="text-xs text-neutral">
            Built with care for better healthcare access.
          </p>
        </div>
      </div>
    </footer>
  );
}
