export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-app px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl dark:bg-secondary/5" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl dark:bg-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,0.02)_0%,transparent_50%),radial-gradient(circle_at_0%_100%,rgba(20,184,166,0.02)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_100%_0%,rgba(37,99,235,0.05)_0%,transparent_50%),radial-gradient(circle_at_0%_100%,rgba(20,184,166,0.05)_0%,transparent_50%)]" />
      </div>
      <div className="relative z-10 w-full max-w-[500px]">
        <div className="card-standard p-8 sm:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
