import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SubmitButton } from "@/components/submit-button";
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
    <main className="min-h-screen bg-default-50 px-6 py-8">
      <section className="mx-auto max-w-3xl rounded-2xl border border-default-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-default-500">New document</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Create Document</h1>
          </div>
          <Link className="text-sm font-medium underline underline-offset-4" href="/dashboard">
            Back to dashboard
          </Link>
        </div>

        {error ? (
          <p
            className="mb-4 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700"
            role="alert"
          >
            Add a title before creating your document.
          </p>
        ) : null}

        <form action={createDocumentAction} className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Title
            <input
              className="mt-2 w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
              maxLength={120}
              name="title"
              required
              type="text"
            />
          </label>

          <label className="block text-sm font-medium text-foreground">
            Content
            <textarea
              className="mt-2 min-h-80 w-full resize-y rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
              name="content"
            />
          </label>

          <SubmitButton
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
            pendingLabel="Creating..."
          >
            Create Document
          </SubmitButton>
        </form>
      </section>
    </main>
  );
}
