import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

type RegisterPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  invalid: "Please enter a valid name, email, and password.",
  exists: "An account already exists for that email address."
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const error = params.error ? errorMessages[params.error] : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-default-50 px-6 py-10">
      <section className="w-full max-w-md rounded-2xl border border-default-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <Link className="text-sm font-medium text-default-500" href="/">
            SyncSpace
          </Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">Create your account</h1>
        </div>

        {error ? (
          <p
            className="mb-4 rounded-lg border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <RegisterForm />

        <p className="mt-6 text-sm text-default-500">
          Already have an account?{" "}
          <Link className="font-medium text-foreground underline underline-offset-4" href="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
