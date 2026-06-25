import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { LocalEditor } from "@/components/local-editor";
import { EditorHeader } from "@/components/editor/editor-header";
import { SubmitButton } from "@/components/submit-button";
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
    restored?: string;
    roles?: string;
    saved?: string;
    shared?: string;
  }>;
};

function Banner({ tone, children }: { tone: "danger" | "success"; children: React.ReactNode }) {
  const toneClass =
    tone === "danger"
      ? "border-danger-200 bg-danger-50 text-danger-700"
      : "border-success-200 bg-success-50 text-success-700";

  return (
    <p className={`rounded-xl border px-4 py-3 text-sm ${toneClass}`} role={tone === "danger" ? "alert" : "status"}>
      {children}
    </p>
  );
}

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
  const restored = query.restored === "1";
  const accessRole =
    document.ownerId === session.user.id
      ? "OWNER"
      : document.members.find((member) => member.userId === session.user.id)?.role;
  const canEdit = accessRole === "OWNER" || accessRole === "EDITOR";
  const canManage = accessRole === "OWNER";

  if (!accessRole) {
    notFound();
  }

  const userLabel = session.user.name ?? session.user.email ?? "You";
  const backHref = "/dashboard";
  const versionsHref = `/dashboard/${document.id}/versions`;

  const banners = (
    <>
      {query.error === "share-invalid" ? (
        <Banner tone="danger">Enter a valid email address and role.</Banner>
      ) : null}
      {query.error === "user-not-found" ? (
        <Banner tone="danger">No user exists with that email address.</Banner>
      ) : null}
      {query.error === "self-share" ? (
        <Banner tone="danger">You already have owner access to this document.</Banner>
      ) : null}
      {shared || rolesUpdated || removed ? <Banner tone="success">Collaborators updated.</Banner> : null}
      {restored ? <Banner tone="success">Version restored.</Banner> : null}
    </>
  );

  return (
    <div className="min-h-screen bg-default-50">
      {canEdit ? (
        <LocalEditor
          backHref={backHref}
          banner={banners}
          documentId={document.id}
          initialContent={document.content}
          initialTitle={document.title}
          initialUpdatedAt={document.updatedAt.getTime()}
          role={accessRole}
          userLabel={userLabel}
          versionsHref={versionsHref}
        />
      ) : (
        <>
          <EditorHeader
            backHref={backHref}
            role={accessRole}
            statusSlot={
              <span className="inline-flex items-center rounded-full bg-default-100 px-2.5 py-1 text-xs font-medium text-default-500">
                View only
              </span>
            }
            title={document.title}
            userLabel={userLabel}
            versionsHref={versionsHref}
          />
          <main className="px-4 py-8 sm:px-6 sm:py-12">
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {banners}
              <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm sm:p-10">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {document.title}
                </h1>
                <p className="mt-6 whitespace-pre-wrap text-base leading-7 text-foreground sm:text-[17px]">
                  {document.content || <span className="text-default-300">No content yet.</span>}
                </p>
              </div>
            </div>
          </main>
        </>
      )}

      {canManage ? (
        <section className="px-4 pb-16 sm:px-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Manage access</h2>

            <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-sm font-semibold text-foreground">Share with an existing SyncSpace account</h3>
              <form
                action={shareDocumentAction.bind(null, document.id)}
                className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto_auto]"
              >
                <input
                  className="rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                  name="email"
                  placeholder="user@example.com"
                  required
                  type="email"
                />
                <select
                  className="rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                  name="role"
                  defaultValue="VIEWER"
                >
                  <option value="OWNER">Owner</option>
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Viewer</option>
                </select>
                <SubmitButton
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                  pendingLabel="Inviting..."
                >
                  Invite
                </SubmitButton>
              </form>
            </div>

            <div className="rounded-2xl border border-default-200 bg-white p-6 shadow-sm sm:p-8">
              <h3 className="text-sm font-semibold text-foreground">Collaborators</h3>
              {document.members.length > 0 ? (
                <div className="mt-4 divide-y divide-default-200 rounded-xl border border-default-200">
                  {document.members.map((member) => (
                    <div
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                      key={member.id}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {member.user.name ?? member.user.email}
                        </p>
                        <p className="mt-1 text-sm text-default-400">{member.user.email}</p>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <form
                          action={updateCollaboratorRoleAction.bind(null, document.id, member.id)}
                          className="flex gap-2"
                        >
                          <select
                            className="rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
                            name="role"
                            defaultValue={member.role}
                          >
                            <option value="OWNER">Owner</option>
                            <option value="EDITOR">Editor</option>
                            <option value="VIEWER">Viewer</option>
                          </select>
                          <SubmitButton
                            className="rounded-lg border border-default-200 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-default-100"
                            pendingLabel="Updating..."
                          >
                            Update
                          </SubmitButton>
                        </form>
                        <form action={removeCollaboratorAction.bind(null, document.id, member.id)}>
                          <SubmitButton
                            className="rounded-lg border border-danger-200 px-3 py-2 text-sm font-medium text-danger-600 transition hover:bg-danger-50"
                            pendingLabel="Removing..."
                          >
                            Remove
                          </SubmitButton>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 rounded-xl border border-dashed border-default-200 px-4 py-8 text-center text-sm text-default-400">
                  No collaborators yet.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-danger-200 bg-danger-50/40 p-6 shadow-sm sm:p-8">
              {/* <h3 className="text-sm font-semibold text-danger-700">Danger zone</h3> */}
              <p className="mt-1 text-sm text-danger-600">
                Deleting this document removes it permanently for you and every collaborator.
              </p>
              <form action={deleteDocumentAction.bind(null, document.id)} className="mt-4">
                <SubmitButton
                  className="rounded-lg border border-danger-300 px-4 py-2 text-sm font-medium text-danger-700 transition hover:bg-danger-100"
                  pendingLabel="Deleting..."
                >
                  Delete document
                </SubmitButton>
              </form>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
