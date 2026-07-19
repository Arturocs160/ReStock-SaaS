import { randomUUID } from "node:crypto";
import {
  getAllCategoriesModel,
  getCategoryByIdModel,
  createCategoryModel,
  updateCategoryModel,
  toggleCategoryActiveModel,
  countActiveProductsByCategoryIdModel,
} from "../models/categoriesModels";

export async function getAllCategoriesService(id_negocio: string, includeInactive: boolean = false) {
  return await getAllCategoriesModel(id_negocio, includeInactive);
}

export async function createCategoryService(id_negocio: string, nombre: string, descripcion: string | null) {
  const id_categoria = randomUUID();
  return await createCategoryModel(id_categoria, id_negocio, nombre, descripcion);
}

export async function updateCategoryService(
  id_categoria: string,
  id_negocio: string,
  nombre: string,
  descripcion: string | null
) {
  const exists = await getCategoryByIdModel(id_categoria, id_negocio);
  if (!exists) {
    throw new Error("La categoría no existe o no pertenece a este negocio.");
  }
  return await updateCategoryModel(id_categoria, id_negocio, nombre, descripcion);
}

export async function toggleCategoryActiveService(id_categoria: string, id_negocio: string) {
  const exists = await getCategoryByIdModel(id_categoria, id_negocio);
  if (!exists) {
    throw new Error("La categoría no existe o no pertenece a este negocio.");
  }
  
  // Si la categoría está activa y se va a desactivar (eliminar), 
  // validamos que no tenga productos activos asociados.
  if (exists.activo) {
    const activeProductsCount = await countActiveProductsByCategoryIdModel(id_categoria, id_negocio);
    if (activeProductsCount > 0) {
      throw new Error("No se puede eliminar la categoría porque contiene productos activos asociados.");
    }
  }
  
  return await toggleCategoryActiveModel(id_categoria, id_negocio);
}
