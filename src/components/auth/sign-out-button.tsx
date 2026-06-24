import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/login"
        });
      }}
    >
      <button
        className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
        type="submit"
      >
        Sign out
      </button>
    </form>
  );
}
