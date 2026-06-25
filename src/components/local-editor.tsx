"use client";

import { AlertTriangle } from "lucide-react";
import type { DocumentRole } from "@prisma/client";
import { useDocumentSync } from "@/hooks/use-document-sync";
import { EditorHeader } from "@/components/editor/editor-header";
import { SyncStatusIndicator } from "@/components/editor/sync-status-indicator";

interface LocalEditorProps {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  initialUpdatedAt: number;
  role: DocumentRole;
  backHref: string;
  versionsHref: string;
  userLabel: string;
  banner?: React.ReactNode;
}

export function LocalEditor({
  documentId,
  initialTitle,
  initialContent,
  initialUpdatedAt,
  role,
  backHref,
  versionsHref,
  userLabel,
  banner
}: LocalEditorProps) {
  const { title, content, setTitle, setContent, status, isOnline, lastSyncedAt } = useDocumentSync({
    documentId,
    initialTitle,
    initialContent,
    initialUpdatedAt
  });

  return (
    <>
      <EditorHeader
        backHref={backHref}
        role={role}
        statusSlot={<SyncStatusIndicator isOnline={isOnline} lastSyncedAt={lastSyncedAt} status={status} />}
        title={title}
        userLabel={userLabel}
        versionsHref={versionsHref}
      />

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {banner}

          {status === "conflict" ? (
            <div
              className="flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700"
              role="alert"
            >
              <AlertTriangle className="mt-0.5 shrink-0" size={18} />
              <div>
                <p className="font-medium">Conflict detected</p>
                <p className="mt-1 text-danger-600">
                  Someone else updated this document while you were editing. Your local draft has
                  been preserved, but auto-sync is paused. Reload the document before continuing.
                </p>
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-default-200 bg-white p-5 shadow-sm transition focus-within:border-primary-300 focus-within:shadow-md sm:p-10">
            <label className="sr-only" htmlFor="document-title">
              Title
            </label>
            <input
              aria-label="Document title"
              className="w-full min-w-0 bg-transparent text-2xl font-bold tracking-tight text-foreground outline-none transition placeholder:text-default-300 sm:text-3xl lg:text-4xl"
              id="document-title"
              maxLength={120}
              name="title"
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Untitled document"
              required
              type="text"
              value={title}
            />

            <label className="sr-only" htmlFor="document-content">
              Content
            </label>
            <textarea
              aria-label="Document content"
              className="editor-scroll editor-selection mt-6 min-h-[60vh] w-full resize-none bg-transparent text-base leading-7 text-foreground outline-none transition placeholder:text-default-300 sm:text-[17px]"
              id="document-content"
              name="content"
              onChange={(event) => setContent(event.target.value)}
              placeholder="Start writing…"
              value={content}
            />
          </div>
        </div>
      </main>
    </>
  );
}
