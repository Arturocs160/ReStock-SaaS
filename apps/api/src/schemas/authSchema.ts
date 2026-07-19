import { z } from "zod";

export const signInSchema = z.object({
  email: z.string({
    required_error: "El correo electrónico es requerido."
  }).email({
    message: "El formato del correo electrónico es inválido."
  }),
  password: z.string({
    required_error: "La contraseña es requerida."
  }).min(1, {
    message: "La contraseña no puede estar vacía."
  }),
});
