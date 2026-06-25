"use client";

import { Button } from "@heroui/react";
import { LogOut } from "lucide-react";
import { useFormStatus } from "react-dom";

export function SignOutTrigger() {
  const { pending } = useFormStatus();

  return (
    <Button
      isDisabled={pending}
      isLoading={pending}
      size="sm"
      startContent={pending ? undefined : <LogOut size={14} />}
      type="submit"
      variant="bordered"
    >
      {pending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
