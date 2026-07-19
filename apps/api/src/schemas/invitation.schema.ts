import { z } from "zod";

export const createInvitationSchema = z.object({
  email_invitado: z.string().email("El formato del correo es inválido"),
  role_asignado: z.enum(["admin", "collaborator"]),
});


export const registerInvitationSchema = z.object({
  token: z.string().min(1, "El token es obligatorio"),

  name: z.string().min(3, "El nombre es obligatorio"),

  email: z.string().email("Correo inválido"),

  password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
});

