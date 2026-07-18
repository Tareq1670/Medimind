export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Your{" "}
        <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          Health
        </span>
        , Intelligently Navigated
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-[var(--color-neutral)]">
        MediMind connects you with the right medicines, doctors, and
        AI-powered symptom insights.
      </p>
    </div>
  );
}
