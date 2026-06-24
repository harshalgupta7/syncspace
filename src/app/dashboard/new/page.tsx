import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { createDocumentAction } from "../actions";

type NewDocumentPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewDocumentPage({ searchParams }: NewDocumentPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const params = await searchParams;
  const error = params.error === "invalid";

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">New document</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">Create Document</h1>
          </div>
          <Link className="text-sm font-medium underline underline-offset-4" href="/dashboard">
            Back to dashboard
          </Link>
        </div>

        {error ? (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Add a title before creating your document.
          </p>
        ) : null}

        <form action={createDocumentAction} className="space-y-4">
          <label className="block text-sm font-medium">
            Title
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              maxLength={120}
              name="title"
              required
              type="text"
            />
          </label>

          <label className="block text-sm font-medium">
            Content
            <textarea
              className="mt-2 min-h-80 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              name="content"
            />
          </label>

          <button
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            type="submit"
          >
            Create Document
          </button>
        </form>
      </section>
    </main>
  );
}
