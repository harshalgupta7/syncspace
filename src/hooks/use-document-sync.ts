"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { syncDocumentAction } from "@/app/dashboard/actions";
import { getLocalDocument, putLocalDocument } from "@/lib/indexeddb";
import { useOnlineStatus } from "@/hooks/use-online-status";

const LOCAL_SAVE_DELAY_MS = 300;
const SYNC_DELAY_MS = 1000;

export type SyncStatus = "saved" | "saving" | "offline";

interface UseDocumentSyncOptions {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  initialUpdatedAt: number;
}

interface UseDocumentSyncResult {
  title: string;
  content: string;
  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  status: SyncStatus;
  isOnline: boolean;
}

export function useDocumentSync({
  documentId,
  initialTitle,
  initialContent,
  initialUpdatedAt
}: UseDocumentSyncOptions): UseDocumentSyncResult {
  const [title, setTitleState] = useState(initialTitle);
  const [content, setContentState] = useState(initialContent);
  const [status, setStatus] = useState<SyncStatus>("saved");
  const isOnline = useOnlineStatus();

  const dirtyRef = useRef(false);
  const syncingRef = useRef(false);
  const latestRef = useRef({ title: initialTitle, content: initialContent });
  const stateRef = useRef({ isOnline, documentId });
  const localSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  stateRef.current = { isOnline, documentId };

  const updateStatus = useCallback(() => {
    if (!stateRef.current.isOnline && dirtyRef.current) {
      setStatus("offline");
    } else if (dirtyRef.current || syncingRef.current) {
      setStatus("saving");
    } else {
      setStatus("saved");
    }
  }, []);

  const syncToServer = useCallback(async () => {
    const { isOnline: online, documentId: id } = stateRef.current;

    if (!online || syncingRef.current) {
      return;
    }

    const pending = latestRef.current;
    syncingRef.current = true;
    updateStatus();

    try {
      const result = await syncDocumentAction(id, pending);

      if (
        result.ok &&
        latestRef.current.title === pending.title &&
        latestRef.current.content === pending.content
      ) {
        dirtyRef.current = false;
      }
    } catch {
      // Network or server failure: keep dirtyRef true so the next edit or
      // reconnect attempt retries. No automatic retry loop by design.
    } finally {
      syncingRef.current = false;
      updateStatus();
    }
  }, [updateStatus]);

  const persistLocal = useCallback(
    (nextTitle: string, nextContent: string) => {
      void putLocalDocument({
        id: documentId,
        title: nextTitle,
        content: nextContent,
        updatedAt: Date.now()
      });
    },
    [documentId]
  );

  const handleEdit = useCallback(
    (nextTitle: string, nextContent: string) => {
      latestRef.current = { title: nextTitle, content: nextContent };
      dirtyRef.current = true;
      updateStatus();

      if (localSaveTimer.current) {
        clearTimeout(localSaveTimer.current);
      }
      localSaveTimer.current = setTimeout(() => {
        persistLocal(nextTitle, nextContent);
      }, LOCAL_SAVE_DELAY_MS);

      if (syncTimer.current) {
        clearTimeout(syncTimer.current);
      }
      syncTimer.current = setTimeout(() => {
        void syncToServer();
      }, SYNC_DELAY_MS);
    },
    [persistLocal, syncToServer, updateStatus]
  );

  const setTitle = useCallback(
    (value: string) => {
      setTitleState(value);
      handleEdit(value, latestRef.current.content);
    },
    [handleEdit]
  );

  const setContent = useCallback(
    (value: string) => {
      setContentState(value);
      handleEdit(latestRef.current.title, value);
    },
    [handleEdit]
  );

  // Restore the local cache once on mount, if it is newer than what the
  // server rendered. Runs after the initial paint so the SSR content shows
  // immediately and is swapped in-place if a newer local draft exists.
  useEffect(() => {
    let active = true;

    void getLocalDocument(documentId).then((local) => {
      if (!active) {
        return;
      }

      if (local && local.updatedAt > initialUpdatedAt) {
        latestRef.current = { title: local.title, content: local.content };
        setTitleState(local.title);
        setContentState(local.content);
        dirtyRef.current = true;
        updateStatus();
        void syncToServer();
      }
    });

    return () => {
      active = false;
    };
    // Only re-run if the document identity itself changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, initialUpdatedAt]);

  // Flush any pending sync as soon as connectivity returns.
  useEffect(() => {
    if (isOnline && dirtyRef.current) {
      void syncToServer();
    } else {
      updateStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  useEffect(() => {
    return () => {
      if (localSaveTimer.current) {
        clearTimeout(localSaveTimer.current);
      }
      if (syncTimer.current) {
        clearTimeout(syncTimer.current);
      }
    };
  }, []);

  return { title, content, setTitle, setContent, status, isOnline };
}
