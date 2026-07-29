import { z } from "zod";

export const productoSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre del producto es obligatorio")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s-]+$/,
      "El nombre solo puede contener letras, números, espacios y guiones medios",
    ),
  codigo_barras: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val))
    .refine((val) => !val || /^[a-zA-Z0-9]+$/.test(val), {
      message: "El código de barras solo puede contener letras y números",
    }),
  id_categoria: z.string().nullable().optional(),
  precio_actual: z
    .number({ message: "El precio debe ser un número" })
    .positive("El precio debe ser un número positivo"),
  stock_minimo_sugerido: z
    .number({ message: "El stock mínimo debe ser un número" })
    .int("El stock mínimo debe ser un número entero")
    .positive("El stock mínimo debe ser un número positivo"),
});

export type ProductoInputData = z.infer<typeof productoSchema>;

export const createLoteSchema = z
  .object({
    codigo_lote: z
      .string()
      .min(1, "El código del lote es obligatorio")
      .regex(
        /^L-\d+$/,
        "El código del lote debe comenzar con 'L-' seguido únicamente de números (por ejemplo: L-689554)",
      ),
    cantidad_inicial: z
      .number({ message: "La cantidad debe ser un número" })
      .int("La cantidad debe ser un número entero")
      .positive("La cantidad ingresada debe ser mayor a 0"),
    fecha_ingreso: z.string(),
    fecha_caducidad: z
      .string()
      .nullable()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val)),
  })
  .refine(
    (data) => {
      if (data.fecha_caducidad && data.fecha_ingreso) {
        return data.fecha_caducidad >= data.fecha_ingreso;
      }
      return true;
    },
    {
      message:
        "La fecha de caducidad no puede ser anterior a la fecha de ingreso.",
      path: ["fecha_caducidad"],
    },
  );

export type CreateLoteInputData = z.infer<typeof createLoteSchema>;

export const editLoteSchema = z
  .object({
    codigo_lote: z
      .string()
      .min(1, "El código del lote es obligatorio")
      .regex(
        /^L-\d+$/,
        "El código del lote debe comenzar con 'L-' seguido únicamente de números (por ejemplo: L-689554)",
      ),
    cantidad_actual: z
      .number({ message: "La cantidad debe ser un número" })
      .int("La cantidad debe ser un número entero")
      .nonnegative("La cantidad no puede ser negativa"),
    fecha_ingreso: z.string(),
    fecha_caducidad: z
      .string()
      .nullable()
      .optional()
      .or(z.literal(""))
      .transform((val) => (val === "" ? null : val)),
  })
  .refine(
    (data) => {
      if (data.fecha_caducidad && data.fecha_ingreso) {
        return data.fecha_caducidad >= data.fecha_ingreso;
      }
      return true;
    },
    {
      message:
        "La fecha de caducidad no puede ser anterior a la fecha de ingreso.",
      path: ["fecha_caducidad"],
    },
  );

export type EditLoteInputData = z.infer<typeof editLoteSchema>;

export const categoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre de la categoría es obligatorio")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s-]+$/,
      "El nombre de la categoría solo puede contener letras, números, espacios y guiones medios",
    ),
  descripcion: z
    .string()
    .nullable()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val)),
});

export type CategoriaInputData = z.infer<typeof categoriaSchema>;
