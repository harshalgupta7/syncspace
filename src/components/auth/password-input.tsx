"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

interface PasswordInputProps {
  autoComplete: string;
  label: string;
  minLength?: number;
  name: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export function PasswordInput({ autoComplete, label, minLength, name, onChange, required }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const inputId = useId();

  return (
    <label className="block text-sm font-medium text-foreground" htmlFor={inputId}>
      {label}
      <div className="relative mt-2">
        <input
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2 pr-10 text-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
          id={inputId}
          minLength={minLength}
          name={name}
          onChange={(event) => onChange?.(event.target.value)}
          required={required}
          type={isVisible ? "text" : "password"}
        />
        <button
          aria-label={isVisible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-default-400 transition hover:text-foreground"
          onClick={() => setIsVisible((visible) => !visible)}
          type="button"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </label>
  );
}
