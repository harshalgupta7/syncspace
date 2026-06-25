import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import { restoreVersionAction } from "../../../actions";

type VersionPreviewPageProps = {
  params: Promise<{
    id: string;
    versionId: string;
  }>;
};

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default async function VersionPreviewPage({ params }: VersionPreviewPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id, versionId } = await params;
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

  const version = await db.documentVersion.findFirst({
    where: {
      id: versionId,
      documentId: id
    },
    select: {
      title: true,
      content: true,
      createdAt: true,
      createdBy: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!version) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-8">
      <section className="mx-auto flex max-w-3xl flex-col gap-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Saved {formatTimestamp(version.createdAt)} by{" "}
                {version.createdBy.name ?? version.createdBy.email}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-normal">{version.title}</h1>
            </div>
            <Link
              className="text-sm font-medium underline underline-offset-4"
              href={`/dashboard/${document.id}/versions`}
            >
              Back to history
            </Link>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Title
              <p className="mt-2 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {version.title}
              </p>
            </label>

            <label className="block text-sm font-medium">
              Content
              <p className="mt-2 min-h-80 w-full whitespace-pre-wrap rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {version.content}
              </p>
            </label>
          </div>

          {canEdit ? (
            <form
              action={restoreVersionAction.bind(null, document.id, versionId)}
              className="mt-4"
            >
              <ConfirmSubmitButton
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                confirmMessage="Restore this version? The document's current title and content will be replaced."
              >
                Restore this version
              </ConfirmSubmitButton>
            </form>
          ) : null}
        </div>
      </section>
    </main>
  );
}
