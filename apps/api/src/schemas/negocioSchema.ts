import { z } from "zod";

export const negocioDbSchema = z.object({
  id_negocio: z.string().uuid({ message: "El ID del negocio debe ser un UUID válido" }),
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
  subdominio: z
    .string()
    .min(1, { message: "El subdominio es obligatorio" })
    .regex(/^[a-z0-9-]+$/, {
      message: "El subdominio solo puede contener letras minúsculas, números y guiones",
    }),
  activo: z.boolean().default(true),
  telefono: z.string().nullable().optional(),
  email_comercial: z
    .string()
    .email({ message: "El correo electrónico debe ser válido" })
    .or(z.literal(""))
    .nullable()
    .optional(),
});

export type Negocio = z.infer<typeof negocioDbSchema>;

export const updateNegocioSchema = negocioDbSchema.omit({
  id_negocio: true,
  activo: true,
});

export type UpdateNegocioInput = z.infer<typeof updateNegocioSchema>;
