export default function DocumentLoading() {
  return (
    <div className="min-h-screen bg-default-50">
      <header className="sticky top-0 z-10 border-b border-default-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-default-200" />
            <div className="h-4 w-36 animate-pulse rounded-full bg-default-200" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-full bg-default-200" />
        </div>
      </header>

      <main className="px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <div className="rounded-2xl border border-default-200 bg-white p-5 shadow-sm sm:p-10">
            <div className="h-8 w-2/3 animate-pulse rounded-full bg-default-200 sm:h-9" />
            <div className="mt-8 space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-default-100" />
              <div className="h-3 w-full animate-pulse rounded-full bg-default-100" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-default-100" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-default-100" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
