import { Request, Response } from "express";
import {
  createProductService,
  deleteProductService,
  getAllProductsServiceByTenantId,
  getProductByBarCodeService,
  getProductsByIdService,
  getProductsPaginationService,
  updateProductService,
  getAllCategoriesService,
} from "../services/productsServices";
import logger from "../utils/logger";

export async function getAllProductsByTenantIdController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const products = await getAllProductsServiceByTenantId(id_negocio);
    res.status(200).json(products);
  } catch (error: any) {
    logger.error("Error al obtener los productos del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getProductsPaginationController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const products = await getProductsPaginationService(id_negocio, page, limit);
    res.status(200).json(products);
  } catch (error: any) {
    logger.error("Error al obtener los productos del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getProductByIdController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const id_producto = req.params.id_producto;

    if (typeof id_producto !== "string") {
      return;
    }

    const product = await getProductsByIdService(id_negocio, id_producto);
    res.status(200).json(product);
  } catch (error: any) {
    logger.error("Error al obtener el producto del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function createProductController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const { codigo_barras, nombre, precio_actual, stock_minimo_sugerido, id_categoria } = req.body;
    const product = await createProductService({
      id_negocio,
      codigo_barras,
      nombre,
      precio_actual,
      stock_minimo_sugerido,
      id_categoria,
    });
    res.status(201).json(product);
  } catch (error: any) {
    logger.error("Error al crear el producto del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function updateProductController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const id_producto = req.params.id_producto;
    const { codigo_barras, nombre, precio_actual, stock_minimo_sugerido, id_categoria } = req.body;

    if (typeof id_producto !== "string") {
      return;
    }

    const product = await updateProductService({
      id_producto,
      id_negocio,
      codigo_barras,
      nombre,
      precio_actual,
      stock_minimo_sugerido,
      id_categoria,
    });
    res.status(200).json(product);
  } catch (error: any) {
    logger.error("Error al actualizar el producto del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function deleteProductController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const id_producto = req.params.id_producto;

    if (typeof id_producto !== "string") {
      return;
    }

    const product = await deleteProductService(id_producto, id_negocio);
    res.status(204).json(product);
  } catch (error: any) {
    logger.error("Error al eliminar el producto del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getProductByBarCodeController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const codigo_barras = req.params.codigo_barras;

    if (typeof codigo_barras !== "string") {
      return;
    }

    const product = await getProductByBarCodeService(id_negocio, codigo_barras);
    res.status(200).json(product);
  } catch (error: any) {
    logger.error("Error al obtener el producto del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function getAllCategoriesController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;
    const categories = await getAllCategoriesService(id_negocio);
    res.status(200).json(categories);
  } catch (error: any) {
    logger.error("Error al obtener las categorías del negocio:" + error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
