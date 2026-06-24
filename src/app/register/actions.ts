"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { registerSchema } from "@/lib/validation";

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    redirect("/register?error=invalid");
  }

  const existingUser = await db.user.findUnique({
    where: {
      email: parsed.data.email
    }
  });

  if (existingUser) {
    redirect("/register?error=exists");
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash
    }
  });

  redirect("/login?registered=1");
}
