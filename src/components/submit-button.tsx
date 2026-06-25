"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: React.ReactNode;
}

export function SubmitButton({ children, className, pendingLabel }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ""}`}
      disabled={pending}
      type="submit"
    >
      {pending ? <Loader2 aria-hidden="true" className="animate-spin" size={16} /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
