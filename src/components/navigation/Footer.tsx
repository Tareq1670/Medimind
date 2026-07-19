import Link from "next/link";
import type { SVGProps } from "react";
import {
  Stethoscope,
  HeartPulse,
  Pill,
  BookText,
  Bot,
  ScanSearch,
  FileText,
  MessageSquareText,
  LifeBuoy,
  ShieldCheck,
  Scale,
  MailQuestion,
} from "lucide-react";

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const quickLinks = [
  { href: "/medicines", label: "Find Medicines", icon: Pill },
  { href: "/doctors", label: "Consult Doctors", icon: HeartPulse },
  { href: "/conditions", label: "Health Directory", icon: BookText },
  { href: "/blogs", label: "Medical Blogs", icon: BookText },
];

const aiTools = [
  { href: "/ai-symptom-checker", label: "AI Symptom Analysis", icon: Bot },
  { href: "/report-analysis", label: "Medical Report Scan", icon: ScanSearch },
  { href: "/prescription-decoder", label: "Prescription Decoder", icon: FileText },
  { href: "/ai-assistant", label: "Virtual Assistant", icon: MessageSquareText },
];

const supportLinks = [
  { href: "/help", label: "Help Center", icon: LifeBuoy },
  { href: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  { href: "/terms", label: "Terms of Service", icon: Scale },
  { href: "/contact", label: "Contact Support", icon: MailQuestion },
];

const socialLinks = [
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
  { href: "https://x.com", label: "X (Twitter)", icon: XIcon },
  { href: "https://linkedin.com", label: "LinkedIn", icon: LinkedinIcon },
  { href: "https://github.com", label: "GitHub", icon: GithubIcon },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">
                MediMind
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              AI-powered healthcare navigation platform connecting patients with
              trusted medical resources, real-time symptom analysis, and intelligent
              clinical insights.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-primary hover:border-primary/30 hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    <link.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              AI Tools
            </h3>
            <ul className="mt-4 space-y-3">
              {aiTools.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    <link.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Support &amp; Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    <link.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary transition-colors duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/70 dark:bg-amber-900/10 px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">
                Medical Disclaimer
              </p>
              <p className="mt-0.5 text-[11px] text-amber-700 dark:text-amber-300/80 leading-relaxed">
                MediMind provides informational content only and does not
                constitute medical advice. Always consult a qualified healthcare
                professional for medical decisions. If you are experiencing a
                medical emergency, call 911 immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-6">
          <p className="text-sm text-center text-slate-500 dark:text-slate-400">
            &copy; {currentYear} MediMind. All rights reserved.{" "}
            <span className="hidden sm:inline">Built for modern clinical intelligence.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
