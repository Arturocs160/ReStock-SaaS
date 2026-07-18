import { z } from "zod";

export const updateNegocioSchema = z.object({
  nombre: z.string().min(1, "El nombre del negocio es requerido").optional(),
  subdominio: z
    .string()
    .min(3, "El subdominio debe tener al menos 3 caracteres")
    .regex(/^[a-z0-9-]+$/, "El subdominio solo puede contener letras minúsculas, números y guiones")
    .optional(),
});
