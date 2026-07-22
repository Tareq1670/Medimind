import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { ErrorBoundary } from "@/components/shared";

export const metadata: Metadata = {
  title: {
    default: "MediMind — AI-Powered Healthcare Platform",
    template: "%s | MediMind",
  },
  description:
    "AI-powered healthcare platform connecting patients with medicines, doctors, and intelligent symptom analysis. Browse 500+ medicines, 50+ doctors, and get AI-driven health insights.",
  keywords: [
    "healthcare",
    "medicine",
    "doctors",
    "AI health assistant",
    "symptom checker",
    "medical reports",
    "health records",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MediMind",
    title: "MediMind — AI-Powered Healthcare Platform",
    description:
      "AI-powered healthcare platform connecting patients with medicines, doctors, and intelligent symptom analysis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MediMind — AI-Powered Healthcare Platform",
    description:
      "AI-powered healthcare platform connecting patients with medicines, doctors, and intelligent symptom analysis.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-bg-app text-slate-900 dark:text-slate-100 transition-layout">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
