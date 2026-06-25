import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { createVersionAction, restoreVersionAction } from "../../actions";

type VersionsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    created?: string;
    error?: string;
  }>;
};

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function VersionsPage({ params, searchParams }: VersionsPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const document = await db.document.findFirst({
    where: {
      id,
      OR: [
        {
          ownerId: session.user.id
        },
        {
          members: {
            some: {
              userId: session.user.id
            }
          }
        }
      ]
    },
    select: {
      id: true,
      title: true,
      ownerId: true,
      members: {
        where: {
          userId: session.user.id
        },
        select: {
          role: true
        },
        take: 1
      }
    }
  });

  if (!document) {
    notFound();
  }

  const accessRole =
    document.ownerId === session.user.id ? "OWNER" : document.members[0]?.role;

  if (!accessRole) {
    notFound();
  }

  const canEdit = accessRole === "OWNER" || accessRole === "EDITOR";

  const versions = await db.documentVersion.findMany({
    where: {
      documentId: id
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      createdAt: true,
      createdBy: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  const query = await searchParams;
  const created = query.created === "1";
  const notFoundError = query.error === "not-found";

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-8">
      <section className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Version history</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal">{document.title}</h1>
            </div>
            <Link
              className="text-sm font-medium underline underline-offset-4"
              href={`/dashboard/${document.id}`}
            >
              Back to document
            </Link>
          </div>

          {created ? (
            <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Version saved.
            </p>
          ) : null}

          {notFoundError ? (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              That version could not be found.
            </p>
          ) : null}

          {canEdit ? (
            <form action={createVersionAction.bind(null, document.id)}>
              <button
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                type="submit"
              >
                Save current version
              </button>
            </form>
          ) : null}

          {versions.length > 0 ? (
            <div className="mt-6 divide-y divide-border rounded-md border border-border">
              {versions.map((version) => (
                <div
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={version.id}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{formatTimestamp(version.createdAt)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      By {version.createdBy.name ?? version.createdBy.email}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      className="rounded-md border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                      href={`/dashboard/${document.id}/versions/${version.id}`}
                    >
                      Preview
                    </Link>
                    {canEdit ? (
                      <form action={restoreVersionAction.bind(null, document.id, version.id)}>
                        <ConfirmSubmitButton
                          className="rounded-md border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                          confirmMessage="Restore this version? The document's current title and content will be replaced."
                        >
                          Restore
                        </ConfirmSubmitButton>
                      </form>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No versions saved yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
