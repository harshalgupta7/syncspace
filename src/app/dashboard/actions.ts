"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { collaboratorRoleSchema, documentSchema, shareDocumentSchema } from "@/lib/validation";
import type { DocumentRole } from "@prisma/client";

async function requireUserId() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return session.user.id;
}

async function getDocumentRole(documentId: string, userId: string): Promise<DocumentRole | null> {
  const document = await db.document.findUnique({
    where: {
      id: documentId
    },
    select: {
      ownerId: true,
      members: {
        where: {
          userId
        },
        select: {
          role: true
        },
        take: 1
      }
    }
  });

  if (!document) {
    return null;
  }

  if (document.ownerId === userId) {
    return "OWNER";
  }

  return document.members[0]?.role ?? null;
}

async function requireDocumentRole(documentId: string, allowedRoles: DocumentRole[]) {
  const userId = await requireUserId();
  const role = await getDocumentRole(documentId, userId);

  if (!role || !allowedRoles.includes(role)) {
    redirect("/dashboard");
  }

  return { userId, role };
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
  await requireDocumentRole(documentId, ["OWNER", "EDITOR"]);
  const parsed = documentSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content")
  });

  if (!parsed.success) {
    redirect(`/dashboard/${documentId}?error=invalid`);
  }

  await db.document.update({
    where: {
      id: documentId
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

export type SyncDocumentResult =
  | { ok: true; updatedAt: number }
  | { ok: false; error: "unauthenticated" | "forbidden" | "invalid" };

export async function syncDocumentAction(
  documentId: string,
  data: { title: string; content: string }
): Promise<SyncDocumentResult> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, error: "unauthenticated" };
  }

  const role = await getDocumentRole(documentId, userId);

  if (role !== "OWNER" && role !== "EDITOR") {
    return { ok: false, error: "forbidden" };
  }

  const parsed = documentSchema.safeParse(data);

  if (!parsed.success) {
    return { ok: false, error: "invalid" };
  }

  const updated = await db.document.update({
    where: {
      id: documentId
    },
    data: {
      title: parsed.data.title,
      content: parsed.data.content
    },
    select: {
      updatedAt: true
    }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${documentId}`);

  return { ok: true, updatedAt: updated.updatedAt.getTime() };
}

export async function deleteDocumentAction(documentId: string) {
  await requireDocumentRole(documentId, ["OWNER"]);

  await db.document.delete({
    where: {
      id: documentId
    }
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function shareDocumentAction(documentId: string, formData: FormData) {
  const { userId } = await requireDocumentRole(documentId, ["OWNER"]);
  const parsed = shareDocumentSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role")
  });

  if (!parsed.success) {
    redirect(`/dashboard/${documentId}?error=share-invalid`);
  }

  const invitedUser = await db.user.findUnique({
    where: {
      email: parsed.data.email
    },
    select: {
      id: true
    }
  });

  if (!invitedUser) {
    redirect(`/dashboard/${documentId}?error=user-not-found`);
  }

  if (invitedUser.id === userId) {
    redirect(`/dashboard/${documentId}?error=self-share`);
  }

  await db.documentMember.upsert({
    where: {
      documentId_userId: {
        documentId,
        userId: invitedUser.id
      }
    },
    create: {
      documentId,
      userId: invitedUser.id,
      role: parsed.data.role
    },
    update: {
      role: parsed.data.role
    }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${documentId}`);
  redirect(`/dashboard/${documentId}?shared=1`);
}

export async function updateCollaboratorRoleAction(
  documentId: string,
  memberId: string,
  formData: FormData
) {
  await requireDocumentRole(documentId, ["OWNER"]);
  const parsed = collaboratorRoleSchema.safeParse({
    role: formData.get("role")
  });

  if (!parsed.success) {
    redirect(`/dashboard/${documentId}?error=role-invalid`);
  }

  await db.documentMember.updateMany({
    where: {
      id: memberId,
      documentId
    },
    data: {
      role: parsed.data.role
    }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${documentId}`);
  redirect(`/dashboard/${documentId}?roles=1`);
}

export async function removeCollaboratorAction(documentId: string, memberId: string) {
  await requireDocumentRole(documentId, ["OWNER"]);

  await db.documentMember.deleteMany({
    where: {
      id: memberId,
      documentId
    }
  });

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/${documentId}`);
  redirect(`/dashboard/${documentId}?removed=1`);
}
