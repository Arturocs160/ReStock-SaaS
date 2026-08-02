import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({
      message: "El correo electrónico es requerido.",
    })
    .email({
      message: "El formato del correo electrónico es inválido.",
    }),
  password: z
    .string({
      message: "La contraseña es requerida.",
    })
    .min(1, {
      message: "La contraseña no puede estar vacía.",
    }),
});
