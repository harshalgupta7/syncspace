import { signOut } from "@/auth";
import { SignOutTrigger } from "./sign-out-trigger";

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
      <SignOutTrigger />
    </form>
  );
}
