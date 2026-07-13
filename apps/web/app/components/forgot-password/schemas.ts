import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "El correo electrónico es requerido")
  .email("El formato del correo electrónico no es válido");

export const otpSchema = z
  .string()
  .length(6, "El código debe tener exactamente 6 dígitos")
  .regex(/^\d+$/, "El código debe contener únicamente números");

export const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener entre 8 y 50 caracteres")
  .max(50, "La contraseña debe tener entre 8 y 50 caracteres")
  .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
  .regex(/[a-z]/, "La contraseña debe contener al menos una letra minúscula")
  .regex(/[0-9]/, "La contraseña debe contener al menos un número")
  .regex(
    /[^A-Za-z0-9]/,
    "La contraseña debe contener al menos un carácter especial",
  );

export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Debe repetir la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
