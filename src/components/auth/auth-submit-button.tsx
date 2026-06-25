"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface AuthSubmitButtonProps {
  label: string;
  pendingLabel: string;
}

export function AuthSubmitButton({ label, pendingLabel }: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? <Loader2 aria-hidden="true" className="animate-spin" size={16} /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}
