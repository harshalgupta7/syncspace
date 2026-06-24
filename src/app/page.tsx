import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <section className="mx-auto flex max-w-5xl flex-col gap-5">
        <p className="text-sm font-medium text-muted-foreground">SyncSpace MVP</p>
        <h1 className="text-3xl font-semibold tracking-normal">Local-first knowledge workspace</h1>
        <p className="max-w-2xl text-muted-foreground">
          Single-app foundation with Next.js, Prisma, Auth.js, Tailwind, Zustand, TanStack Query, and HTTP-based sync planned for the editor MVP.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            href="/register"
          >
            Create account
          </Link>
          <Link
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            href="/login"
          >
            Sign in
          </Link>
        </div>
      </section>
    </main>
  );
}
