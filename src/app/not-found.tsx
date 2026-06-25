import { FileQuestion } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-default-50 px-6 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileQuestion size={28} />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-default-500">
        The page you&apos;re looking for doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        className="mt-6 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
        href="/dashboard"
      >
        Back to dashboard
      </Link>
    </main>
  );
}
