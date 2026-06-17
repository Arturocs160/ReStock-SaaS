import { z } from 'zod';

export const productoDbSchema = z.object({
    id_producto: z.uuid({ message: "El ID del producto debe ser un UUID válido" }),
    id_negocio: z.uuid({ message: "El ID del negocio debe ser un UUID válido" }),
    codigo_barras: z.string().nullable().optional(),
    nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
    precio_actual: z.number().positive({ message: "El precio debe ser un número positivo" }),
    stock_minimo_sugerido: z.number().int().nonnegative({ message: "El stock mínimo debe ser un entero mayor o igual a 0" }).default(0),
    id_categoria: z.string().uuid({ message: "El ID de la categoría debe ser un UUID válido" }).nullable().optional(),
});

export type Producto = z.infer<typeof productoDbSchema>;

export const createProductoSchema = productoDbSchema.omit({
    id_producto: true,
    id_negocio: true
});

export type CreateProductoInput = z.infer<typeof createProductoSchema>;

export const updateProductoSchema = productoDbSchema
    .omit({
        id_producto: true,
        id_negocio: true
    })
    .partial();

export type UpdateProductoInput = z.infer<typeof updateProductoSchema>;

export const productoIdParamSchema = z.object({
    id_producto: z.uuid({ message: "ID de producto inválido en los parámetros" }),
});

export type ProductoIdParam = z.infer<typeof productoIdParamSchema>;

export const productoBarcodeParamSchema = z.object({
    codigo_barras: z.string().min(1, { message: "El código de barras no puede estar vacío" }),
});

export type ProductoBarcodeParam = z.infer<typeof productoBarcodeParamSchema>;

export const getProductsPaginationQuerySchema = z.object({
    page: z.string()
        .regex(/^\d+$/, { message: "La página debe ser un número entero positivo" })
        .optional(),
    limit: z.string()
        .regex(/^\d+$/, { message: "El límite debe ser un número entero positivo" })
        .optional(),
});

export type GetProductsPaginationQuery = z.infer<typeof getProductsPaginationQuerySchema>;