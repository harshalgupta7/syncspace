import { Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DocumentCard, type DocumentCardData } from "@/components/dashboard/document-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { NewDocumentButton } from "@/components/dashboard/new-document-button";
import { db } from "@/lib/db";
import type { DocumentRole } from "@prisma/client";
import { deleteDocumentAction } from "./actions";

function getPreview(content: string) {
  const collapsed = content.replace(/\s+/g, " ").trim();

  if (!collapsed) {
    return "No content yet.";
  }

  return collapsed.length > 140 ? `${collapsed.slice(0, 140)}…` : collapsed;
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const myDocuments = await db.document.findMany({
    where: {
      ownerId: session.user.id
    },
    orderBy: {
      updatedAt: "desc"
    },
    select: {
      id: true,
      title: true,
      content: true,
      updatedAt: true
    }
  });

  const sharedDocuments = await db.documentMember.findMany({
    where: {
      userId: session.user.id,
      document: {
        ownerId: {
          not: session.user.id
        }
      }
    },
    orderBy: {
      document: {
        updatedAt: "desc"
      }
    },
    select: {
      role: true,
      document: {
        select: {
          id: true,
          title: true,
          content: true,
          updatedAt: true,
          owner: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  const documents: Array<{ data: DocumentCardData; updatedAt: Date; canDelete: boolean }> = [
    ...myDocuments.map((document) => ({
      data: {
        id: document.id,
        title: document.title,
        preview: getPreview(document.content),
        updatedAt: document.updatedAt.getTime(),
        role: "OWNER" as DocumentRole,
        ownerLabel: "You"
      },
      updatedAt: document.updatedAt,
      canDelete: true
    })),
    ...sharedDocuments.map(({ document, role }) => ({
      data: {
        id: document.id,
        title: document.title,
        preview: getPreview(document.content),
        updatedAt: document.updatedAt.getTime(),
        role,
        ownerLabel: document.owner.name ?? document.owner.email ?? "Unknown owner"
      },
      updatedAt: document.updatedAt,
      canDelete: role === "OWNER"
    }))
  ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <div className="min-h-screen bg-default-50">
      <header className="border-b border-default-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link className="flex items-center gap-2 font-semibold text-foreground" href="/dashboard">
            <Sparkles className="text-primary" size={20} />
            SyncSpace
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-default-500 sm:inline">{session.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Documents</h1>
            <p className="mt-2 text-default-500">
              Everything you own or have been given access to, in one place.
            </p>
          </div>
          <NewDocumentButton />
        </div>

        {documents.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {documents.map(({ data, canDelete }) => (
              <DocumentCard
                deleteAction={canDelete ? deleteDocumentAction.bind(null, data.id) : undefined}
                document={data}
                key={data.id}
              />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
