"use client";

import { useState } from "react";
import { registerAction } from "@/app/register/actions";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { PasswordInput } from "@/components/auth/password-input";

export function RegisterForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);

  const passwordsMismatch = confirmTouched && confirmPassword.length > 0 && password !== confirmPassword;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (password !== confirmPassword) {
      event.preventDefault();
      setConfirmTouched(true);
    }
  }

  return (
    <form action={registerAction} className="space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-medium text-foreground">
        Name
        <input
          autoComplete="name"
          className="mt-2 w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
          name="name"
          required
          type="text"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Email
        <input
          autoComplete="email"
          className="mt-2 w-full rounded-lg border border-default-200 bg-default-50 px-3 py-2 text-sm outline-none transition focus:border-primary-300 focus:ring-2 focus:ring-primary-200"
          name="email"
          required
          type="email"
        />
      </label>

      <PasswordInput
        autoComplete="new-password"
        label="Password"
        minLength={8}
        name="password"
        onChange={setPassword}
        required
      />

      <div>
        <PasswordInput
          autoComplete="new-password"
          label="Confirm password"
          minLength={8}
          name="confirmPassword"
          onChange={(value) => {
            setConfirmPassword(value);
            setConfirmTouched(true);
          }}
          required
        />
        {passwordsMismatch ? (
          <p className="mt-2 text-sm text-danger-600" role="alert">
            Passwords do not match.
          </p>
        ) : null}
      </div>

      <AuthSubmitButton label="Create account" pendingLabel="Creating account..." />
    </form>
  );
}
