import Link from "next/link";
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
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">SyncSpace</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">Sign in</h1>
        </div>

        {registered ? (
          <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Account created. You can sign in now.
          </p>
        ) : null}

        {error ? (
          <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <form action={loginAction} className="space-y-4">
          <label className="block text-sm font-medium">
            Email
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="block text-sm font-medium">
            Password
            <input
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              name="password"
              required
              type="password"
            />
          </label>

          <button
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            type="submit"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          New to SyncSpace?{" "}
          <Link className="font-medium text-foreground underline underline-offset-4" href="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
