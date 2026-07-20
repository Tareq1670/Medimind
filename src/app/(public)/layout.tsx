import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg-app text-slate-900 dark:text-slate-100 transition-layout">
        {children}
      </main>
      <Footer />
    </>
  );
}
