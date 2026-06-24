import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { db } from "@/lib/db";
import { deleteDocumentAction } from "./actions";

function formatUpdatedAt(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const documents = await db.document.findMany({
    where: {
      ownerId: session.user.id
    },
    orderBy: {
      updatedAt: "desc"
    },
    select: {
      id: true,
      title: true,
      updatedAt: true
    }
  });

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">SyncSpace Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">
              Welcome, {session.user.name ?? "there"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <SignOutButton />
        </header>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-normal">Your documents</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {documents.length === 1 ? "1 document" : `${documents.length} documents`}
              </p>
            </div>
            <Link
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              href="/dashboard/new"
            >
              Create Document
            </Link>
          </div>

          {documents.length > 0 ? (
            <div className="mt-6 divide-y divide-border rounded-md border border-border">
              {documents.map((document) => (
                <div
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={document.id}
                >
                  <Link className="min-w-0" href={`/dashboard/${document.id}`}>
                    <h3 className="truncate text-sm font-medium">{document.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Updated {formatUpdatedAt(document.updatedAt)}
                    </p>
                  </Link>
                  <form action={deleteDocumentAction.bind(null, document.id)}>
                    <button
                      className="rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                      type="submit"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No documents yet. Create your first document to start writing.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
