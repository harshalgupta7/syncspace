import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LocalEditor } from "@/components/local-editor";
import {
  deleteDocumentAction,
  removeCollaboratorAction,
  shareDocumentAction,
  updateCollaboratorRoleAction
} from "../actions";

type EditDocumentPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    removed?: string;
    roles?: string;
    saved?: string;
    shared?: string;
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
      content: true,
      updatedAt: true,
      ownerId: true,
      members: {
        orderBy: {
          createdAt: "asc"
        },
        select: {
          id: true,
          role: true,
          userId: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!document) {
    notFound();
  }

  const query = await searchParams;
  const shared = query.shared === "1";
  const rolesUpdated = query.roles === "1";
  const removed = query.removed === "1";
  const accessRole =
    document.ownerId === session.user.id
      ? "OWNER"
      : document.members.find((member) => member.userId === session.user.id)?.role;
  const canEdit = accessRole === "OWNER" || accessRole === "EDITOR";
  const canManage = accessRole === "OWNER";

  if (!accessRole) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-8">
      <section className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {canEdit ? "Edit document" : "View document"} - {accessRole}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">{document.title}</h1>
          </div>
          <Link className="text-sm font-medium underline underline-offset-4" href="/dashboard">
            Back to dashboard
          </Link>
        </div>

        {query.error === "share-invalid" ? (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            Enter a valid email address and role.
          </p>
        ) : null}

        {query.error === "user-not-found" ? (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            No user exists with that email address.
          </p>
        ) : null}

        {query.error === "self-share" ? (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            You already have owner access to this document.
          </p>
        ) : null}

        {shared || rolesUpdated || removed ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Collaborators updated.
          </p>
        ) : null}

        {canEdit ? (
          <LocalEditor
            documentId={document.id}
            initialContent={document.content}
            initialTitle={document.title}
            initialUpdatedAt={document.updatedAt.getTime()}
          />
        ) : (
          <div className="space-y-4">
            <label className="block text-sm font-medium">
              Title
              <p className="mt-2 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {document.title}
              </p>
            </label>

            <label className="block text-sm font-medium">
              Content
              <p className="mt-2 min-h-80 w-full whitespace-pre-wrap rounded-md border border-input bg-muted px-3 py-2 text-sm">
                {document.content}
              </p>
            </label>
          </div>
        )}

        {canManage ? (
          <form action={deleteDocumentAction.bind(null, document.id)} className="mt-4">
          <button
            className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
            type="submit"
          >
            Delete Document
          </button>
        </form>
        ) : null}
      </div>

      {canManage ? (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-normal">Share Document</h2>
          <form action={shareDocumentAction.bind(null, document.id)} className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <input
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              name="email"
              placeholder="user@example.com"
              required
              type="email"
            />
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              name="role"
              defaultValue="VIEWER"
            >
              <option value="OWNER">OWNER</option>
              <option value="EDITOR">EDITOR</option>
              <option value="VIEWER">VIEWER</option>
            </select>
            <button
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              type="submit"
            >
              Invite
            </button>
          </form>
        </div>
      ) : null}

      {canManage ? (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-normal">Collaborators</h2>
          {document.members.length > 0 ? (
            <div className="mt-4 divide-y divide-border rounded-md border border-border">
              {document.members.map((member) => (
                <div
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  key={member.id}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {member.user.name ?? member.user.email}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{member.user.email}</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <form
                      action={updateCollaboratorRoleAction.bind(null, document.id, member.id)}
                      className="flex gap-2"
                    >
                      <select
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                        name="role"
                        defaultValue={member.role}
                      >
                        <option value="OWNER">OWNER</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                      <button
                        className="rounded-md border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted"
                        type="submit"
                      >
                        Update
                      </button>
                    </form>
                    <form action={removeCollaboratorAction.bind(null, document.id, member.id)}>
                      <button
                        className="rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10"
                        type="submit"
                      >
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-md border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No collaborators yet.
            </p>
          )}
        </div>
      ) : null}
      </section>
    </main>
  );
}
