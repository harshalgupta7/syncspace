import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { deleteDocumentAction, updateDocumentAction } from "../actions";

type EditDocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function EditDocumentPage({ params, searchParams }: EditDocumentPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const document = await db.document.findFirst({
    where: {
      id,
      ownerId: session.user.id
    },
    select: {
      id: true,
      title: true,
      content: true
    }
  });

  if (!document) {
    notFound();
  }

  const query = await searchParams;
  const error = query.error === "invalid";
  const saved = query.saved === "1";

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-8">
      <section className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Edit document</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">{document.title}</h1>
          </div>
          <Link className="text-sm font-medium underline underline-offset-4" href="/dashboard">
            Back to dashboard
          </Link>
        </div>

        {error ? (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Title is required and content must be under the allowed length.
          </p>
        ) : null}

        {saved ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Document saved.
          </p>
        ) : null}

        <form action={updateDocumentAction.bind(null, document.id)} className="space-y-4">
          <label className="block text-sm font-medium">
            Title
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              defaultValue={document.title}
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
              defaultValue={document.content}
              name="content"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              type="submit"
            >
              Save Changes
            </button>
          </div>
        </form>

        <form action={deleteDocumentAction.bind(null, document.id)} className="mt-4">
          <button
            className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
            type="submit"
          >
            Delete Document
          </button>
        </form>
      </section>
    </main>
  );
}
