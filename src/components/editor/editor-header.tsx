"use client";

import { Avatar, Chip, Tooltip } from "@heroui/react";
import { ArrowLeft, Crown, Eye, History, Pencil } from "lucide-react";
import Link from "next/link";
import type { DocumentRole } from "@prisma/client";

const roleConfig: Record<
  DocumentRole,
  { label: string; color: "warning" | "primary" | "default"; icon: typeof Crown }
> = {
  OWNER: { label: "Owner", color: "warning", icon: Crown },
  EDITOR: { label: "Editor", color: "primary", icon: Pencil },
  VIEWER: { label: "Viewer", color: "default", icon: Eye }
};

function getInitials(label: string): string {
  const parts = label.trim().split(/\s+/);
  const initials = parts.length > 1 ? `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}` : parts[0]?.slice(0, 2) ?? "";

  return initials.toUpperCase();
}

function RoleBadge({ role }: { role: DocumentRole }) {
  const { label, color, icon: Icon } = roleConfig[role];

  return (
    <Chip
      className="hidden sm:flex"
      color={color}
      size="sm"
      startContent={<Icon className="ml-1" size={12} />}
      variant="flat"
    >
      {label}
    </Chip>
  );
}

interface EditorHeaderProps {
  title: string;
  role: DocumentRole;
  backHref: string;
  versionsHref: string;
  userLabel: string;
  statusSlot?: React.ReactNode;
}

export function EditorHeader({
  title,
  role,
  backHref,
  versionsHref,
  userLabel,
  statusSlot
}: EditorHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-default-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Tooltip content="Back to dashboard">
            <Link
              aria-label="Back to dashboard"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-default-500 outline-none transition hover:bg-default-100 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary"
              href={backHref}
            >
              <ArrowLeft size={18} />
            </Link>
          </Tooltip>
          <div className="hidden h-6 w-px bg-default-200 sm:block" aria-hidden="true" />
          <p className="min-w-0 truncate text-sm font-semibold text-foreground sm:text-base">
            {title || "Untitled document"}
          </p>
          <RoleBadge role={role} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {statusSlot}
          <Tooltip content="Version history">
            <Link
              aria-label="Version history"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-default-500 outline-none transition hover:bg-default-100 hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary sm:flex"
              href={versionsHref}
            >
              <History size={18} />
            </Link>
          </Tooltip>
          <Tooltip content={userLabel}>
            <Avatar
              className="shrink-0 text-xs"
              getInitials={getInitials}
              name={userLabel}
              size="sm"
            />
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
