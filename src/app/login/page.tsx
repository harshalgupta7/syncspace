import Link from "next/link";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { PasswordInput } from "@/components/auth/password-input";
import { loginAction } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    registered?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  invalid: "Please enter a valid email and password.",
  credentials: "Invalid email or password."
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error ? errorMessages[params.error] : null;
  const registered = params.registered === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-default-50 px-6 py-10">
      <section className="w-full max-w-md rounded-2xl border border-default-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <p className="text-sm font-medium text-default-500">SyncSpace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
        </div>

        {registered ? (
          <p
            className="mb-4 rounded-lg border border-success-200 bg-success-50 px-3 py-2 text-sm text-success-700"
            role="status"
          >
            Account created. You can sign in now.
          </p>
        ) : null}

        {error ? (
          <p
            className="mb-4 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <form action={loginAction} className="space-y-4">
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

          <PasswordInput autoComplete="current-password" label="Password" name="password" required />

          <AuthSubmitButton label="Sign in" pendingLabel="Signing in..." />
        </form>

        <p className="mt-6 text-sm text-default-500">
          New to SyncSpace?{" "}
          <Link className="font-medium text-foreground underline underline-offset-4" href="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
