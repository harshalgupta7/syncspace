"use client";

import { Button } from "@heroui/react";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

export function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-default-300 bg-white px-6 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileText size={28} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-foreground">No documents yet</h2>
      <p className="mt-2 max-w-sm text-sm text-default-500">
        Create your first document to start writing, or wait for a teammate to share one with you.
      </p>
      <Button
        as={Link}
        className="mt-6"
        color="primary"
        href="/dashboard/new"
        startContent={<Plus size={18} />}
      >
        Create Document
      </Button>
    </div>
  );
}
