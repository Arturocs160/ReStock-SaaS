import { z } from "zod";

export const createCategoriaSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre de la categoría es obligatorio" }),
  descripcion: z.string().nullable().optional(),
});

export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;

export const updateCategoriaSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre de la categoría es obligatorio" }),
  descripcion: z.string().nullable().optional(),
});

export type UpdateCategoriaInput = z.infer<typeof updateCategoriaSchema>;

export const categoriaIdParamSchema = z.object({
  id_categoria: z.uuid({ message: "ID de categoría inválido en los parámetros" }),
});

export type CategoriaIdParam = z.infer<typeof categoriaIdParamSchema>;

export const getCategoriesQuerySchema = z.object({
  all: z.string().optional(),
});

export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
