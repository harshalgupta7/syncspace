"use client";

import { useDocumentSync, type SyncStatus } from "@/hooks/use-document-sync";

interface LocalEditorProps {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  initialUpdatedAt: number;
}

function statusLabel(status: SyncStatus): string {
  switch (status) {
    case "saving":
      return "Saving...";
    case "offline":
      return "Offline changes";
    case "saved":
    default:
      return "Saved";
  }
}

export function LocalEditor({
  documentId,
  initialTitle,
  initialContent,
  initialUpdatedAt
}: LocalEditorProps) {
  const { title, content, setTitle, setContent, status, isOnline } = useDocumentSync({
    documentId,
    initialTitle,
    initialContent,
    initialUpdatedAt
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground" aria-live="polite">
        <span>{statusLabel(status)}</span>
        {!isOnline ? (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
            Offline
          </span>
        ) : null}
      </div>

      <label className="block text-sm font-medium">
        Title
        <input
          className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          maxLength={120}
          name="title"
          onChange={(event) => setTitle(event.target.value)}
          required
          type="text"
          value={title}
        />
      </label>

      <label className="block text-sm font-medium">
        Content
        <textarea
          className="mt-2 min-h-80 w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          name="content"
          onChange={(event) => setContent(event.target.value)}
          value={content}
        />
      </label>
    </div>
  );
}
