import logger from "../utils/logger";
import {
  createLoteService,
  deleteLoteService,
  getLoteByIdService,
  getLotesExpiracionService,
  getLotesByProductIdService,
  updateLoteService,
  createMermaService,
} from "../services/loteServices";
import { Request, Response } from "express";

export async function createLoteController(req: Request, res: Response) {
  try {
    const { id_producto, codigo_lote, fecha_ingreso, fecha_caducidad, cantidad_inicial } = req.body;
    const lote = await createLoteService(
      id_producto,
      codigo_lote,
      fecha_ingreso,
      fecha_caducidad,
      cantidad_inicial
    );
    res.status(201).json(lote);
  } catch (error: any) {
    logger.error("Error al crear lote" + error);
    res.status(500).json({ error: error.message });
  }
}

export async function getLotesByProductIdController(req: Request, res: Response) {
  try {
    const { id_producto } = req.params as any;
    const id_negocio = req.user?.id_negocio;

    const lotes = await getLotesByProductIdService(id_producto, id_negocio);
    res.status(200).json(lotes);
  } catch (error: any) {
    logger.error("Error al obtener lotes por producto" + error);
    res.status(500).json({ error: error.message });
  }
}

export async function getLotesExpiracionController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      res.status(401).json({
        error: "SesiÃ³n invÃ¡lida o expirada",
        message: "No autorizado. Inicia sesiÃ³n primero.",
      });
      return;
    }

    const lotes = await getLotesExpiracionService(id_negocio);
    res.status(200).json({ lotes });
  } catch (error: any) {
    logger.error({ err: error }, "Error al obtener lotes por expiracion");
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getLoteByIdController(req: Request, res: Response) {
  try {
    const { id_lote } = req.params;
    const id_negocio = req.user?.id_negocio;

    if (typeof id_lote !== "string") {
      return;
    }

    const lote = await getLoteByIdService(id_lote, id_negocio);
    res.status(200).json(lote);
  } catch (error: any) {
    logger.error("Error al obtener lote por id" + error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateLoteController(req: Request, res: Response) {
  try {
    const { id_lote } = req.params;
    const id_negocio = req.user?.id_negocio;
    const { codigo_lote, fecha_ingreso, fecha_caducidad, cantidad_inicial } = req.body;

    if (typeof id_lote !== "string") {
      return;
    }

    const lote = await updateLoteService(
      id_lote,
      id_negocio,
      codigo_lote,
      fecha_ingreso,
      fecha_caducidad,
      cantidad_inicial
    );
    res.status(200).json(lote);
  } catch (error: any) {
    logger.error("Error al actualizar lote" + error);
    res.status(500).json({ error: error.message });
  }
}

export async function deleteLoteController(req: Request, res: Response) {
  try {
    const { id_lote } = req.params;
    const id_negocio = req.user?.id_negocio;

    if (typeof id_lote !== "string") {
      return;
    }

    const result = await deleteLoteService(id_lote, id_negocio);
    res.status(204).json(result);
  } catch (error: any) {
    logger.error("Error al eliminar lote" + error);
    res.status(500).json({ error: error.message });
  }
}

export async function createMermaController(req: Request, res: Response) {
  try {
    const { id_lote } = req.params;
    const id_negocio = req.user?.id_negocio;
    const id_usuario = req.user?.id;
    const { cantidad, motivo } = req.body;

    if (typeof id_lote !== "string") {
      res.status(400).json({ error: "ID de lote inválido" });
      return;
    }

    if (!id_usuario) {
      res.status(401).json({
        error: "Sesión inválida o expirada",
        message: "No autorizado. Inicia sesión primero.",
      });
      return;
    }

    const merma = await createMermaService(id_lote, id_negocio, cantidad, motivo, id_usuario);

    res.status(200).json(merma);
  } catch (error: any) {
    logger.error("Error al registrar merma: " + error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || "Error interno del servidor",
      message: error.message,
    });
  }
}
