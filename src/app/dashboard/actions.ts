"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { documentSchema } from "@/lib/validation";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user.id;
}

export async function createDocumentAction(formData: FormData) {
  const ownerId = await requireUserId();
  const parsed = documentSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content")
  });

  if (!parsed.success) {
    redirect("/dashboard/new?error=invalid");
  }

  const document = await db.document.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      ownerId
    },
    select: {
      id: true
    }
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/${document.id}`);
}

export async function updateDocumentAction(documentId: string, formData: FormData) {
  const ownerId = await requireUserId();
  const parsed = documentSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content")
  });

  if (!parsed.success) {
    redirect(`/dashboard/${documentId}?error=invalid`);
  }

  await db.document.updateMany({
    where: {
      id: documentId,
      ownerId
    },
    data: {
      title: parsed.data.title,
      content: parsed.data.content
    }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${documentId}`);
  redirect(`/dashboard/${documentId}?saved=1`);
}

export async function deleteDocumentAction(documentId: string) {
  const ownerId = await requireUserId();

  await db.document.deleteMany({
    where: {
      id: documentId,
      ownerId
    }
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
