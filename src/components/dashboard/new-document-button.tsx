"use client";

import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import Link from "next/link";

export function NewDocumentButton() {
  return (
    <Button
      as={Link}
      className="w-full sm:w-auto"
      color="primary"
      href="/dashboard/new"
      startContent={<Plus size={18} />}
    >
      New Document
    </Button>
  );
}
