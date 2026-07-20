export default function PublicLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center pt-20">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <p className="text-sm text-neutral">Loading...</p>
      </div>
    </div>
  );
}
