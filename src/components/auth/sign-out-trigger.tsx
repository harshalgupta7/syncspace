"use client";

import { Button } from "@heroui/react";
import { LogOut } from "lucide-react";

export function SignOutTrigger() {
  return (
    <Button size="sm" startContent={<LogOut size={14} />} type="submit" variant="bordered">
      Sign out
    </Button>
  );
}
