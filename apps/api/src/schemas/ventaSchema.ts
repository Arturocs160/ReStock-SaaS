import { z } from "zod";

export const createVentaItemSchema = z.object({
  id_lote: z.string().uuid({ message: "El ID del lote debe ser un UUID válido" }),
  cantidad_sold: z.number().int().positive({ message: "La cantidad vendida debe ser un entero positivo" }),
  precio_unitario: z.number().nonnegative({ message: "El precio unitario debe ser un número mayor o igual a 0" }),
});

export const createVentaSchema = z.object({
  items: z.array(createVentaItemSchema).min(1, { message: "Debe incluir al menos un producto en la venta" }),
});

export type CreateVentaInput = z.infer<typeof createVentaSchema>;
export type CreateVentaItemInput = z.infer<typeof createVentaItemSchema>;
