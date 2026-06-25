"use client";

import { AlertTriangle, Check, CloudOff, Loader2, Wifi, WifiOff } from "lucide-react";
import type { SyncStatus } from "@/hooks/use-document-sync";

const statusConfig: Record<
  SyncStatus,
  { label: string; icon: typeof Check; className: string; spin?: boolean }
> = {
  saved: { label: "Saved", icon: Check, className: "bg-success-50 text-success-600" },
  saving: { label: "Saving…", icon: Loader2, className: "bg-primary-50 text-primary-600", spin: true },
  offline: { label: "Offline edits", icon: CloudOff, className: "bg-warning-50 text-warning-600" },
  conflict: { label: "Sync failed", icon: AlertTriangle, className: "bg-danger-50 text-danger-600" }
};

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("en", { timeStyle: "short" }).format(timestamp);
}

interface SyncStatusIndicatorProps {
  status: SyncStatus;
  isOnline: boolean;
  lastSyncedAt: number;
}

export function SyncStatusIndicator({ status, isOnline, lastSyncedAt }: SyncStatusIndicatorProps) {
  const { label, icon: Icon, className, spin } = statusConfig[status];

  return (
    <div aria-live="polite" className="flex items-center gap-2 text-xs sm:text-sm">
      <span className="hidden items-center gap-1 text-default-400 md:inline-flex" title={`Last updated ${formatTime(lastSyncedAt)}`}>
        {isOnline ? (
          <Wifi aria-label="Online" className="text-success-500" size={14} />
        ) : (
          <WifiOff aria-label="Offline" className="text-default-400" size={14} />
        )}
      </span>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${className}`}
      >
        <Icon className={spin ? "animate-spin" : ""} size={13} />
        {label}
      </span>
      <span className="hidden text-default-400 lg:inline">Updated {formatTime(lastSyncedAt)}</span>
    </div>
  );
}
