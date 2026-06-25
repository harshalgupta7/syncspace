export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-default-50">
      <header className="border-b border-default-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="h-5 w-28 animate-pulse rounded-full bg-default-200" />
          <div className="h-9 w-20 animate-pulse rounded-lg bg-default-200" />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded-full bg-default-200" />
            <div className="h-4 w-72 animate-pulse rounded-full bg-default-200" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded-lg bg-default-200" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="rounded-2xl border border-default-200 bg-white p-5" key={index}>
              <div className="flex items-start justify-between gap-3">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-default-200" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-default-200" />
              </div>
              <div className="mt-4 h-4 w-3/4 animate-pulse rounded-full bg-default-200" />
              <div className="mt-2 h-3 w-full animate-pulse rounded-full bg-default-100" />
              <div className="mt-1 h-3 w-5/6 animate-pulse rounded-full bg-default-100" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
