"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-default-50 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger-600">
        <AlertTriangle size={28} />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-sm text-default-500">
        An unexpected error occurred. You can try again, or head back to your documents.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          className="rounded-lg border border-default-200 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-default-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
        <a
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
          href="/dashboard"
        >
          Back to dashboard
        </a>
      </div>
    </main>
  );
}
