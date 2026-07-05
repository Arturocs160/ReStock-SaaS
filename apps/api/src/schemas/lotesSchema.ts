import { z } from "zod";

export const productoSchema = z.object({
  id_producto: z.uuid(),
  id_negocio: z.uuid(),
  codigo_barras: z.uuid().nullable().optional(),
  nombre: z.string().min(1),
  precio_actual: z.number().positive(),
  stock_minimo_sugerido: z.number().int().nonnegative().default(0),
  activo: z.boolean().default(true),
  id_categoria: z.uuid().nullable().optional(),
});

export const loteInventarioSchema = z.object({
  id_lote: z.uuid(),
  id_producto: z.uuid(),
  codigo_lote: z.string().min(1),
  fecha_ingreso: z.coerce.date(),
  fecha_caducidad: z.coerce.date().nullable().optional(),
  cantidad_inicial: z.number().int().positive(),
  activo: z.boolean().default(true),
});

export const loteConProductoSchema = loteInventarioSchema.extend({
  producto: productoSchema,
});

export const createLoteSchema = loteInventarioSchema
  .omit({
    id_lote: true,
    activo: true,
  })
  .refine(
    (data) => {
      if (data.fecha_caducidad && data.fecha_ingreso) {
        return data.fecha_caducidad >= data.fecha_ingreso;
      }
      return true;
    },
    {
      message: "La fecha de caducidad no puede ser anterior a la fecha de ingreso",
      path: ["fecha_caducidad"],
    }
  );

export const updateLoteSchema = loteInventarioSchema
  .omit({
    id_lote: true,
    activo: true,
  })
  .partial()
  .refine(
    (data) => {
      if (data.fecha_caducidad && data.fecha_ingreso) {
        return data.fecha_caducidad >= data.fecha_ingreso;
      }
      return true;
    },
    {
      message: "La fecha de caducidad no puede ser anterior a la fecha de ingreso",
      path: ["fecha_caducidad"],
    }
  );

export const loteIdParamSchema = z.object({
  id_lote: z.uuid({ message: "ID de lote inválido en los parámetros" }),
});

export type LoteInventario = z.infer<typeof loteInventarioSchema>;
export type LoteConProducto = z.infer<typeof loteConProductoSchema>;
export type CreateLoteInput = z.infer<typeof createLoteSchema>;
export type UpdateLoteInput = z.infer<typeof updateLoteSchema>;
export type LoteIdParam = z.infer<typeof loteIdParamSchema>;
