import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-muted/30 px-6 py-8">
      <section className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">SyncSpace Dashboard</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">
              Welcome, {session.user.name ?? "there"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{session.user.email}</p>
          </div>
          <SignOutButton />
        </header>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold tracking-normal">Your workspace</h2>
          <p className="mt-2 text-muted-foreground">Documents coming in Phase 2</p>
        </section>
      </section>
    </main>
  );
}
