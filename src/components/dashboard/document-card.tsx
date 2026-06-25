"use client";

import { Card, CardBody, CardFooter, Chip, Divider } from "@heroui/react";
import { Clock, Crown, Eye, Pencil, FileText } from "lucide-react";
import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/confirm-submit-button";
import type { DocumentRole } from "@prisma/client";

const roleConfig: Record<
  DocumentRole,
  { label: string; color: "warning" | "primary" | "default"; icon: typeof Crown }
> = {
  OWNER: { label: "Owner", color: "warning", icon: Crown },
  EDITOR: { label: "Editor", color: "primary", icon: Pencil },
  VIEWER: { label: "Viewer", color: "default", icon: Eye }
};

function RoleBadge({ role }: { role: DocumentRole }) {
  const { label, color, icon: Icon } = roleConfig[role];

  return (
    <Chip color={color} size="sm" startContent={<Icon className="ml-1" size={12} />} variant="flat">
      {label}
    </Chip>
  );
}

export interface DocumentCardData {
  id: string;
  title: string;
  preview: string;
  updatedAt: number;
  role: DocumentRole;
  ownerLabel: string;
}

function formatUpdatedAt(updatedAt: number) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(updatedAt));
}

interface DocumentCardProps {
  document: DocumentCardData;
  deleteAction?: (formData: FormData) => void | Promise<void>;
}

export function DocumentCard({ document, deleteAction }: DocumentCardProps) {
  return (
    <Card className="border border-default-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardBody className="gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText size={20} />
          </div>
          <RoleBadge role={document.role} />
        </div>
        <Link className="block min-w-0" href={`/dashboard/${document.id}`}>
          <h3 className="truncate text-base font-semibold text-foreground transition-colors hover:text-primary">
            {document.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-default-500">{document.preview}</p>
        </Link>
      </CardBody>
      <Divider />
      <CardFooter className="flex items-center justify-between gap-3 px-5 py-3">
        <div className="flex min-w-0 flex-col gap-0.5 text-xs text-default-400">
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            Updated {formatUpdatedAt(document.updatedAt)}
          </span>
          <span className="truncate">{document.ownerLabel}</span>
        </div>
        {deleteAction ? (
          <form action={deleteAction}>
            <ConfirmSubmitButton
              className="rounded-md px-2 py-1 text-xs font-medium text-danger transition hover:bg-danger/10"
              confirmMessage="Delete this document? This action cannot be undone."
              pendingLabel="Deleting..."
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </CardFooter>
    </Card>
  );
}
