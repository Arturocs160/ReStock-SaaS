import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Correo electrónico inválido")
    .min(1, "El correo electrónico es requerido")
    .transform((val) => val.toLowerCase()),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)",
    ),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .regex(/[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]/, "El nombre debe contener solo letras"),
    apellidos: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .regex(/[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]/, "El apellido debe contener solo letras"),
    negocio: z
      .string()
      .min(2, "El nombre del negocio debe tener al menos 2 caracteres")
      .regex(
        /[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]/,
        "El nombre del negocio solo debe contener letras",
      ),
    email: z
      .email("Correo electrónico inválido")
      .min(1, "El correo electrónico es requerido")
      .transform((val) => val.toLowerCase()),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Debe contener al menos un carácter especial",
      )
      .regex(/[a-z]/, "Debe contener al menos una minúscula"),
    confirmPassword: z
      .string()
      .min(8, "La confirmación debe tener al menos 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterFormData = RegisterFormValues;

export const invitationRegisterSchema = z
  .object({
    name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

    email: z
      .string()
      .email("Correo electrónico inválido")
      .transform((val) => val.toLowerCase()),

    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener una mayúscula")
      .regex(/[a-z]/, "Debe contener una minúscula")
      .regex(/[0-9]/, "Debe contener un número"),

    confirmPassword: z.string(),

    token: z.string().min(1, "Token inválido"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

export type InvitationRegisterValues = z.infer<typeof invitationRegisterSchema>;
