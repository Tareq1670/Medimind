import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-6xl font-bold text-slate-200 dark:text-slate-700">404</div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Page Not Found</h1>
      <p className="max-w-md text-sm text-neutral">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary/90"
      >
        Go back home
      </Link>
    </div>
  );
}
