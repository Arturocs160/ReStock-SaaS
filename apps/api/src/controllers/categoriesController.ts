import { Request, Response } from "express";
import {
  getAllCategoriesService,
  createCategoryService,
  updateCategoryService,
  toggleCategoryActiveService,
} from "../services/categoriesServices";
import logger from "../utils/logger";

export async function getAllCategoriesController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const includeInactive = req.query.all === "true";
    const categories = await getAllCategoriesService(id_negocio, includeInactive);
    res.status(200).json(categories);
  } catch (error: any) {
    logger.error("Error al obtener las categorías del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function createCategoryController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const { nombre, descripcion } = req.body;
    const category = await createCategoryService(id_negocio, nombre, descripcion);
    res.status(201).json(category);
  } catch (error: any) {
    logger.error("Error al crear la categoría:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function updateCategoryController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const { id_categoria } = req.params;
    const { nombre, descripcion } = req.body;

    if (typeof id_categoria !== "string") {
      res.status(400).json({ message: "ID de categoría inválido" });
      return;
    }

    const category = await updateCategoryService(id_categoria, id_negocio, nombre, descripcion);
    res.status(200).json(category);
  } catch (error: any) {
    logger.error("Error al actualizar la categoría:" + error);
    if (error.message.includes("no existe")) {
      res.status(404).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function toggleCategoryActiveController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const { id_categoria } = req.params;

    if (typeof id_categoria !== "string") {
      res.status(400).json({ message: "ID de categoría inválido" });
      return;
    }

    const category = await toggleCategoryActiveService(id_categoria, id_negocio);
    res.status(200).json(category);
  } catch (error: any) {
    logger.error("Error al cambiar el estado de la categoría:" + error);
    if (error.message.includes("no existe")) {
      res.status(404).json({ message: error.message });
      return;
    }
    if (error.message.includes("No se puede eliminar")) {
      res.status(400).json({ message: error.message });
      return;
    }
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
