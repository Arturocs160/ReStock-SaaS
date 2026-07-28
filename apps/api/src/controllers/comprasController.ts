import { Request, Response } from "express";
import logger from "../utils/logger";
import {
  getSugerenciasReabastecimientoService,
  createOrdenCompraService,
} from "../services/comprasServices";

export async function getSugerenciasController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res.status(401).json({
        error: "Sesión inválida o expirada",
        message: "ID de negocio ausente en la sesión.",
      });
    }

    const sugerencias = await getSugerenciasReabastecimientoService(id_negocio);
    res.status(200).json(sugerencias);
  } catch (error: any) {
    logger.error("Error al obtener sugerencias de reabastecimiento: " + error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createOrdenCompraController(req: Request, res: Response) {
  try {
    const id_negocio = req.user?.id_negocio;

    if (!id_negocio) {
      return res.status(401).json({
        error: "Sesión inválida o expirada",
        message: "ID de negocio ausente en la sesión.",
      });
    }

    const lotes = await createOrdenCompraService(id_negocio, req.body);
    res.status(201).json({ lotes });
  } catch (error: any) {
    logger.error("Error al registrar orden de abastecimiento: " + error.message);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: error.message || "Error interno del servidor",
      message: error.message,
    });
  }
}
