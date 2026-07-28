import { z } from "zod";

export const itemOrdenCompraSchema = z.object({
  id_producto: z.uuid({ message: "El ID del producto debe ser un UUID válido" }),
  cantidad: z
    .number({ message: "La cantidad debe ser un número" })
    .int({ message: "La cantidad debe ser un número entero" })
    .positive({ message: "La cantidad debe ser un entero positivo mayor a 0" }),
});

export const createOrdenCompraSchema = z
  .array(itemOrdenCompraSchema, {
    message: "El cuerpo de la orden debe ser un arreglo de productos",
  })
  .min(1, { message: "La orden debe incluir al menos un producto" });

export type ItemOrdenCompraInput = z.infer<typeof itemOrdenCompraSchema>;
export type CreateOrdenCompraInput = z.infer<typeof createOrdenCompraSchema>;
