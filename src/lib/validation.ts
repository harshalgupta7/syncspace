import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  password: z.string().min(1, "Password is required.")
});

export const documentSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120, "Title is too long."),
  content: z.string().max(50000, "Content is too long.")
});

export const shareDocumentSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  role: z.enum(["OWNER", "EDITOR", "VIEWER"])
});

export const collaboratorRoleSchema = z.object({
  role: z.enum(["OWNER", "EDITOR", "VIEWER"])
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
export type CollaboratorRoleInput = z.infer<typeof collaboratorRoleSchema>;
